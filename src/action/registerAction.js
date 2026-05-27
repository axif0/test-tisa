import { getData, saveData } from '../services/githubDB'

async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const asyncRegister = (data, changeTab, notify) => {
    return async (dispatch) => {
        try {
            const users = await getData('users.json')
            const existingUser = users.find(u => u.email === data.email)
            if (existingUser) {
                if (notify) {
                    notify({ error: true, errorMessage: 'Email already registered' })
                }
                return
            }
            const hashedPw = await hashPassword(data.password)
            const newUser = {
                _id: Date.now().toString(),
                username: data.username,
                email: data.email,
                password: hashedPw,
                businessName: data.businessName,
                address: data.address,
                createdAt: new Date().toISOString()
            }
            await saveData('users.json', [...users, newUser])
            const { password, ...userWithoutPassword } = newUser
            localStorage.setItem('tishaUser', JSON.stringify(userWithoutPassword))
            changeTab('login')
        } catch (err) {
            alert(err.message)
        }
    }
}
