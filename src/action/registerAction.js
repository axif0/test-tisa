import { getData, saveData } from '../services/githubDB'
import { hashPassword } from '../utils/hashPassword'
import Swal from 'sweetalert2'

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
            Swal.fire({ icon: 'error', title: 'Registration Failed', text: err.message })
        }
    }
}
