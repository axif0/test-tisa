import React, { useState } from 'react'
import { TextField, Button, Box, CircularProgress } from '@mui/material'
import { useDispatch } from 'react-redux'
import { asyncAddProducts, asyncUpdateProducts } from '../../action/productAction'
import { englishToBengali, isValidMixedNumber, convertMixedInputToNumber } from '../../utils/bengaliNumerals'

const ProductForm = (props) => {
    const { name: prodName, price: prodPrice, _id, resetUpdateProd } = props
    const [ name, setName ] = useState(prodName ? prodName : '')
    const [ price, setPrice ] = useState(englishToBengali(prodPrice ? prodPrice : ''))
    const [ formErrors, setFormErrors ] = useState({})
    const [ loading, setLoading ] = useState(false)
    const errors = {}
    const dispatch = useDispatch()

    const handleChange = (e) => {
        if(e.target.name === 'name') {
            setName(e.target.value)
        } else if(e.target.name === 'price') {
            const value = e.target.value;
            
            if (value === '') {
                setPrice('');
                return;
            }

            if (!isValidMixedNumber(value)) {
                return;
            }

            setPrice(value);
        }
    }

    const validate = () => {
        if(name.length === 0) {
            errors.name = "product name can't be blank"
        }
        if(price.length === 0) {
            errors.price = "enter valid amount"
        }
        setFormErrors(errors)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        validate()
        if(Object.keys(errors).length === 0) {
            setLoading(true)
            const formData = {
                name: name.length > 0 ? name[0].toUpperCase() + name.slice(1) : name,
                price: convertMixedInputToNumber(price)
            }
            try {
                if(_id) {
                    await dispatch(asyncUpdateProducts(_id, formData, resetUpdateProd))
                } else {
                    await dispatch(asyncAddProducts(formData, resetForm))
                }
            } finally {
                setLoading(false)
            }
        }
    }

    const resetForm = () => {
        setName('')
        setPrice('')
        setFormErrors({})
    }

    const handleCancel = () => {
        resetForm()
        if (resetUpdateProd) {
            resetUpdateProd()
        }
    }

    return (
        <Box component='form' onSubmit={handleSubmit} sx={{ mt: '20px' }}>
            <TextField
                sx={{ width: '100%', mb: '15px' }}
                label='পণ্যের নাম'
                name='name'
                value={name}
                onChange={handleChange}
                error={formErrors.name ? true : false}
                helperText={formErrors.name ? formErrors.name : null}
                required
                disabled={loading}
            />
            <TextField
                sx={{ width: '100%', mb: '15px' }}
                label='দাম'
                name='price'
                value={price}
                onChange={handleChange}
                error={formErrors.price ? true : false}
                helperText={formErrors.price ? formErrors.price : null}
                required
                disabled={loading}
            />
            <Box>
                <Button
                    variant='contained'
                    type='submit'
                    color='primary'
                    sx={{ marginRight: '10px' }}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {loading ? (_id ? 'Updating...' : 'Adding...') : (_id ? 'Update' : 'Add')}
                </Button>
                <Button
                    variant='contained'
                    onClick={handleCancel}
                    type='button'
                    disabled={loading}
                >
                    বাতিল
                </Button>
            </Box>
        </Box>
    )
}

export default ProductForm
