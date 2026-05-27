import { getData, saveData } from '../services/githubDB'

export const setLogin = () => {
    return {
        type: 'SET_LOGIN',
        payload: true
    }
}

export const setLogout = () => {
    return {
        type: 'SET_LOGOUT',
        payload: false
    }
}

async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const asyncLogin = (data, history, notify) => {
    return async (dispatch) => {
        try {
            const users = await getData('users.json')
            const hashedPw = await hashPassword(data.password)
            const user = users.find(u => u.email === data.email && u.password === hashedPw)
            if (user) {
                const { password, ...userWithoutPassword } = user
                localStorage.setItem('tishaUser', JSON.stringify(userWithoutPassword))
                dispatch(setLogin())
                history.push('/dashboard')
            } else {
                const notifyError = { error: true, errorMessage: 'Invalid email or password' }
                notify(notifyError)
            }
        } catch (err) {
            console.log(err)
            alert(err.message)
        }
    }
}
