import { getData, saveData } from '../services/githubDB'

export const setBills = (data) => {
    return {
        type: 'SET_BILLS',
        payload: data.reverse()
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
            alert(err.message)
        }
    }
}

export const asyncAddBill = (data, navigate) => {
    return async (dispatch) => {
        try {
            const list = await getData('bills.json')
            const customers = await getData('customers.json')
            const products = await getData('products.json')

            const customer = customers.find(c => c._id === data.customer) || {}
            const items = data.items.map(item => {
                const product = products.find(p => p._id === item.product) || {}
                return {
                    product: { _id: product._id, name: product.name, price: product.price },
                    quantity: item.quantity,
                    price: item.price,
                    subTotal: item.subTotal
                }
            })

            const newBill = {
                _id: Date.now().toString(),
                date: data.date,
                customer: { _id: customer._id, name: customer.name, email: customer.email, mobile: customer.mobile, address: customer.address },
                items,
                total: data.total,
                createdAt: new Date().toISOString()
            }

            await saveData('bills.json', [...list, newBill])
            dispatch(addBill(newBill))
            return { data: newBill }
        } catch (err) {
            console.error('Bill generation error:', err)
            throw err
        }
    }
}

export const asyncDeleteBill = (id) => {
    return async (dispatch) => {
        try {
            const list = await getData('bills.json')
            const bill = list.find(b => b._id === id)
            await saveData('bills.json', list.filter(b => b._id !== id))
            dispatch(deleteBill(bill))
            return bill
        } catch (err) {
            console.error('Delete bill error:', err)
            throw err
        }
    }
}

export const asyncGetBillDetail = (id, handleChange) => {
    return async (dispatch) => {
        try {
            const data = await getData('bills.json')
            const bill = data.find(b => b._id === id)
            if (bill) {
                handleChange(bill)
            }
            return bill
        } catch (err) {
            console.error('Failed to fetch bill details:', err)
            throw err
        }
    }
}
