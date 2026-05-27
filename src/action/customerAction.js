import { getData, saveData } from '../services/githubDB'
import Swal from 'sweetalert2'

export const setCustomers = (data) => {
    return {
        type: 'SET_CUSTOMERS',
        payload: data
    }
}

export const addCustomer = (data) => {
    return {
        type: 'ADD_CUSTOMER',
        payload: data
    }
}

export const deleteCustomer = (data) => {
    return {
        type: 'DELETE_CUSTOMER',
        payload: data
    }
}

export const updateCustomer = (data) => {
    return {
        type: 'UPDATE_CUSTOMER',
        payload: data
    }
}

export const asyncCustomerDetail = (id, handleChange) => {
    return async () => {
        try {
            const data = await getData('customers.json')
            const customer = data.find(c => c._id === id)
            if (customer) {
                handleChange(customer)
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}

export const asyncGetCustomers = () => {
    return async (dispatch) => {
        try {
            const data = await getData('customers.json')
            dispatch(setCustomers(data))
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}

export const asyncAddCustomer = (data, reset, closeModal) => {
    return async (dispatch) => {
        try {
            const list = await getData('customers.json')
            const newCustomer = { ...data, _id: crypto.randomUUID() }
            const updated = [...list, newCustomer]
            await saveData('customers.json', updated)
            dispatch(addCustomer(newCustomer))
            reset()
            if (closeModal) {
                closeModal()
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}

export const asyncDeleteCustomer = (id) => {
    return async (dispatch) => {
        try {
            const list = await getData('customers.json')
            const customer = list.find(c => c._id === id)
            const updated = list.filter(c => c._id !== id)
            await saveData('customers.json', updated)
            dispatch(deleteCustomer(customer))
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}

export const asyncUpdateCustomer = (id, data, reset) => {
    return async (dispatch) => {
        try {
            const list = await getData('customers.json')
            const updatedCustomer = { _id: id, ...data }
            const updated = list.map(c => c._id === id ? updatedCustomer : c)
            await saveData('customers.json', updated)
            dispatch(updateCustomer(updatedCustomer))
            reset()
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}
