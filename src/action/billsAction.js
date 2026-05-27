import { getData, saveData } from '../services/githubDB'
import Swal from 'sweetalert2'

export const setBills = (data) => {
    return {
        type: 'SET_BILLS',
        payload: [...data].reverse()
    }
}

export const addBill = (data) => {
    return {
        type: 'ADD_BILL',
        payload: data
    }
}

export const deleteBill = (data) => {
    return {
        type: 'DELETE_BILL',
        payload: data
    }
}

export const asyncGetBills = () => {
    return async (dispatch) => {
        try {
            const data = await getData('bills.json')
            dispatch(setBills(data))
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
        }
    }
}

export const asyncAddBill = (data) => {
    return async (dispatch) => {
        try {
            const list = await getData('bills.json')
            const customers = await getData('customers.json')
            const products = await getData('products.json')

            const customer = customers.find(c => c._id === data.customer)
            if (!customer) throw new Error('Customer not found')

            const items = data.items.map(item => {
                const product = products.find(p => p._id === item.product)
                if (!product) throw new Error('Product not found')
                return {
                    product: { _id: product._id, name: product.name, price: product.price },
                    quantity: item.quantity,
                    price: item.price,
                    subTotal: Math.round(item.subTotal * 100) / 100
                }
            })

            const newBill = {
                _id: crypto.randomUUID(),
                date: data.date,
                customer: { _id: customer._id, name: customer.name, email: customer.email, mobile: customer.mobile, address: customer.address },
                items,
                total: Math.round(data.total * 100) / 100,
                createdAt: new Date().toISOString()
            }

            await saveData('bills.json', [...list, newBill])
            dispatch(addBill(newBill))
            return { data: newBill }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Bill Error', text: err.message })
            throw err
        }
    }
}

export const asyncDeleteBill = (id) => {
    return async (dispatch) => {
        try {
            const list = await getData('bills.json')
            const bill = list.find(b => b._id === id)
            if (!bill) throw new Error('Bill not found')
            await saveData('bills.json', list.filter(b => b._id !== id))
            dispatch(deleteBill(bill))
            return bill
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Delete Error', text: err.message })
            throw err
        }
    }
}

export const asyncGetBillDetail = (id, handleChange) => {
    return async () => {
        try {
            const data = await getData('bills.json')
            const bill = data.find(b => b._id === id)
            if (bill) {
                handleChange(bill)
            }
            return bill
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message })
            throw err
        }
    }
}
