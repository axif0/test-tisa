const TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const OWNER = process.env.REACT_APP_GITHUB_REPO_OWNER;
const REPO = process.env.REACT_APP_GITHUB_REPO_NAME;
const DATA_PATH = process.env.REACT_APP_GITHUB_DATA_PATH;

const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${DATA_PATH}`;

const CACHE_TTL = 30000;
const DEBOUNCE_DELAY = 1500;
const MAX_RETRIES = 3;

const authHeaders = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
};

const cache = {};
const debounceTimers = {};
const pendingWrites = {};
const writeQueues = {};
const writeResolvers = {};

function encodeContent(dataArray) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(dataArray, null, 2))));
}

function decodeContent(base64) {
  return JSON.parse(decodeURIComponent(escape(atob(base64))));
}

async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) return response;

      if ((response.status === 403 || response.status === 429) && attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`Rate limited (${response.status}), retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      if (response.status === 409 && attempt < retries) {
        const fileUrl = url;
        const shaUrl = options.method === 'PUT' ? fileUrl : url;
        const shaResponse = await fetch(shaUrl, { headers: authHeaders });
        if (shaResponse.ok) {
          const fileData = await shaResponse.json();
          const filename = url.split('/').pop();
          if (cache[filename]) {
            cache[filename].sha = fileData.sha;
          }
        }
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      return response;
    } catch (error) {
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw error;
    }
  }
}

export async function getData(filename) {
  const now = Date.now();
  if (cache[filename] && (now - cache[filename].fetchedAt) < CACHE_TTL) {
    return cache[filename].data;
  }

  try {
    const url = `${API_BASE}/${filename}`;
    const response = await fetchWithRetry(url, { headers: authHeaders });

    if (!response.ok) {
      if (response.status === 404) {
        cache[filename] = { data: [], sha: null, fetchedAt: now };
        return [];
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const fileData = await response.json();
    const data = decodeContent(fileData.content);

    cache[filename] = { data, sha: fileData.sha, fetchedAt: now };
    return data;
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);
    return cache[filename]?.data || [];
  }
}

async function executeSave(filename) {
  const dataArray = pendingWrites[filename];
  if (!dataArray) return;

  delete pendingWrites[filename];

  try {
    const url = `${API_BASE}/${filename}`;
    const content = encodeContent(dataArray);

    let currentSHA = cache[filename]?.sha;

    if (!currentSHA) {
      const getResponse = await fetchWithRetry(url, { headers: authHeaders });
      if (getResponse.ok) {
        const fileData = await getResponse.json();
        currentSHA = fileData.sha;
      }
    }

    const body = { message: `update ${filename}`, content };
    if (currentSHA) body.sha = currentSHA;

    const putResponse = await fetchWithRetry(url, {
      method: 'PUT',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!putResponse.ok) {
      if (putResponse.status === 409) {
        delete cache[filename];
        const retryGet = await fetchWithRetry(url, { headers: authHeaders });
        if (retryGet.ok) {
          const retryFileData = await retryGet.json();
          body.sha = retryFileData.sha;
          const retryPut = await fetchWithRetry(url, {
            method: 'PUT',
            headers: { ...authHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          if (!retryPut.ok) {
            throw new Error(`GitHub save failed after retry: ${retryPut.status}`);
          }
          const putResult = await retryPut.json();
          cache[filename] = { data: dataArray, sha: putResult.content.sha, fetchedAt: Date.now() };
          return true;
        }
      }
      throw new Error(`GitHub save failed: ${putResponse.status}`);
    }

    const putResult = await putResponse.json();
    cache[filename] = { data: dataArray, sha: putResult.content.sha, fetchedAt: Date.now() };
    return true;
  } catch (error) {
    throw new Error(`GitHub save failed: ${filename} - ${error.message}`);
  }
}

async function processQueue(filename) {
  const queue = writeQueues[filename];
  if (!queue || queue.length === 0) return;

  const { resolve, reject } = queue[0];

  try {
    const result = await executeSave(filename);
    resolve(result);
  } catch (error) {
    reject(error);
  } finally {
    queue.shift();
    if (queue.length > 0) {
      processQueue(filename);
    }
  }
}

export function saveData(filename, dataArray) {
  pendingWrites[filename] = dataArray;

  if (cache[filename]) {
    cache[filename].data = dataArray;
  }

  return new Promise((resolve, reject) => {
    if (!writeQueues[filename]) {
      writeQueues[filename] = [];
    }

    const queueItem = { resolve, reject };
    writeQueues[filename].push(queueItem);

    if (writeQueues[filename].length === 1) {
      if (debounceTimers[filename]) {
        clearTimeout(debounceTimers[filename]);
      }

      debounceTimers[filename] = setTimeout(() => {
        delete debounceTimers[filename];
        processQueue(filename);
      }, DEBOUNCE_DELAY);
    }
  });
}

export async function flushAll() {
  for (const filename of Object.keys(debounceTimers)) {
    if (debounceTimers[filename]) {
      clearTimeout(debounceTimers[filename]);
      delete debounceTimers[filename];
    }
  }

  const filenames = Object.keys(pendingWrites);
  const promises = filenames.map(filename => {
    if (!writeQueues[filename]) {
      writeQueues[filename] = [];
    }
    return new Promise((resolve, reject) => {
      writeQueues[filename].push({ resolve, reject });
      if (writeQueues[filename].length === 1) {
        processQueue(filename);
      }
    });
  });

  return Promise.allSettled(promises);
}
