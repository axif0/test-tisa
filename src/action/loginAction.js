import { getData } from '../services/githubDB'
import { hashPassword } from '../utils/hashPassword'
import Swal from 'sweetalert2'

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

export const asyncLogin = (data, navigate, notify) => {
    return async (dispatch) => {
        try {
            const users = await getData('users.json')
            const hashedPw = await hashPassword(data.password)
            const user = users.find(u => u.email === data.email && u.password === hashedPw)
            if (user) {
                const { password, ...userWithoutPassword } = user
                localStorage.setItem('tishaUser', JSON.stringify(userWithoutPassword))
                dispatch(setLogin())
                navigate('/dashboard')
            } else {
                notify({ error: true, errorMessage: 'Invalid email or password' })
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Login Failed', text: err.message })
        }
    }
}
