import { getData, saveData } from '../services/githubDB'
import Swal from 'sweetalert2'

export const setProducts = (data) => {
    return {
        type: 'SET_PRODUCTS',
        payload: data
    }
}

export const addProduct = (data) => {
    return {
        type: 'ADD_PRODUCT',
        payload: data
    }
}

export const updateProduct = (data) => {
    return {
        type: 'UPDATE_PRODUCT',
        payload: data
    }
}

export const deleteProduct = (data) => {
    return {
        type: 'DELETE_PRODUCT',
        payload: data
    }
}

export const asyncGetProducts = () => {
    return async (dispatch) => {
        try {
            const data = await getData('products.json')
            dispatch(setProducts(data))
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}

export const asyncAddProducts = (data, reset) => {
    return async (dispatch) => {
        try {
            const list = await getData('products.json')
            const newProduct = { ...data, _id: crypto.randomUUID() }
            const updated = [...list, newProduct]
            await saveData('products.json', updated)
            dispatch(addProduct(newProduct))
            reset()
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}

export const asyncUpdateProducts = (id, data, reset) => {
    return async (dispatch) => {
        try {
            const list = await getData('products.json')
            const updatedProduct = { _id: id, ...data }
            const updated = list.map(p => p._id === id ? updatedProduct : p)
            await saveData('products.json', updated)
            dispatch(updateProduct(updatedProduct))
            reset()
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}

export const asyncDeleteProducts = (id) => {
    return async (dispatch) => {
        try {
            const list = await getData('products.json')
            const product = list.find(p => p._id === id)
            const updated = list.filter(p => p._id !== id)
            await saveData('products.json', updated)
            dispatch(deleteProduct(product))
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}

export const asyncProductDetail = (id, stateChange) => {
    return async () => {
        try {
            const data = await getData('products.json')
            const product = data.find(p => p._id === id)
            if (product) {
                stateChange(product)
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}
