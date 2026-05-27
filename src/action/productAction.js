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
    return async (dispatch, getState) => {
        try {
            const { products } = getState()
            const newProduct = { ...data, _id: crypto.randomUUID() }
            const updated = [...products, newProduct]
            dispatch(addProduct(newProduct))
            reset()
            await saveData('products.json', updated)
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}

export const asyncUpdateProducts = (id, data, reset) => {
    return async (dispatch, getState) => {
        try {
            const { products } = getState()
            const updatedProduct = { _id: id, ...data }
            const updated = products.map(p => p._id === id ? updatedProduct : p)
            dispatch(updateProduct(updatedProduct))
            reset()
            await saveData('products.json', updated)
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}

export const asyncDeleteProducts = (id) => {
    return async (dispatch, getState) => {
        try {
            const { products } = getState()
            const product = products.find(p => p._id === id)
            const updated = products.filter(p => p._id !== id)
            dispatch(deleteProduct(product))
            await saveData('products.json', updated)
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}

export const asyncProductDetail = (id, stateChange) => {
    return async (dispatch, getState) => {
        try {
            const { products } = getState()
            const product = products.find(p => p._id === id)
            if (product) {
                stateChange(product)
            } else {
                const data = await getData('products.json')
                const found = data.find(p => p._id === id)
                if (found) stateChange(found)
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}
