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
    return async (dispatch, getState) => {
        try {
            const { customers } = getState()
            const customer = customers.find(c => c._id === id)
            if (customer) {
                handleChange(customer)
            } else {
                const data = await getData('customers.json')
                const found = data.find(c => c._id === id)
                if (found) handleChange(found)
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
    return async (dispatch, getState) => {
        try {
            const { customers } = getState()
            const newCustomer = { ...data, _id: crypto.randomUUID() }
            const updated = [...customers, newCustomer]
            dispatch(addCustomer(newCustomer))
            reset()
            if (closeModal) closeModal()
            await saveData('customers.json', updated)
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}

export const asyncDeleteCustomer = (id) => {
    return async (dispatch, getState) => {
        try {
            const { customers } = getState()
            const customer = customers.find(c => c._id === id)
            const updated = customers.filter(c => c._id !== id)
            dispatch(deleteCustomer(customer))
            await saveData('customers.json', updated)
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}

export const asyncUpdateCustomer = (id, data, reset) => {
    return async (dispatch, getState) => {
        try {
            const { customers } = getState()
            const updatedCustomer = { _id: id, ...data }
            const updated = customers.map(c => c._id === id ? updatedCustomer : c)
            dispatch(updateCustomer(updatedCustomer))
            reset()
            await saveData('customers.json', updated)
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}
