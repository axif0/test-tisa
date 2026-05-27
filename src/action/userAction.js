export const setUser = (data) => {
    return {
        type: 'SET_USER',
        payload: data
    }
}

export const asyncGetUser = () => {
    return (dispatch) => {
        try {
            const user = JSON.parse(localStorage.getItem('tishaUser'))
            if (user) {
                dispatch(setUser(user))
            }
        } catch (err) {
            // Silently handle corrupted localStorage data
            localStorage.removeItem('tishaUser')
        }
    }
}
