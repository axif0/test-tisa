const TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const OWNER = process.env.REACT_APP_GITHUB_REPO_OWNER;
const REPO = process.env.REACT_APP_GITHUB_REPO_NAME;
const DATA_PATH = process.env.REACT_APP_GITHUB_DATA_PATH;

const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${DATA_PATH}`;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
};

export async function getData(filename) {
  try {
    const url = `${API_BASE}/${filename}`;
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const data = await response.json();
    const content = decodeURIComponent(escape(atob(data.content)));
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);
    return [];
  }
}

export async function saveData(filename, dataArray) {
  try {
    const url = `${API_BASE}/${filename}`;

    const getResponse = await fetch(url, { headers });
    if (!getResponse.ok) {
      throw new Error(`Failed to get file SHA: ${getResponse.status}`);
    }
    const fileData = await getResponse.json();
    const currentSHA = fileData.sha;

    const content = btoa(unescape(encodeURIComponent(JSON.stringify(dataArray, null, 2))));

    const putResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `update ${filename}`,
        content,
        sha: currentSHA,
      }),
    });

    if (!putResponse.ok) {
      throw new Error(`GitHub save failed: ${putResponse.status}`);
    }

    return true;
  } catch (error) {
    throw new Error(`GitHub save failed: ${filename} - ${error.message}`);
  }
}
