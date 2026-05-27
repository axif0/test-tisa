import React, { useState } from 'react'
import { Box, TextField, Button, CircularProgress } from '@mui/material'
import { useDispatch } from 'react-redux'
import { asyncAddCustomer, asyncUpdateCustomer } from '../../action/customerAction'
import validator from 'validator'

const formFieldSx = {
    width: '100%',
    maxWidth: '250px',
    mr: '1vw',
    minWidth: '180px'
}

const CustomerForm = (props) => {
    const { name: custName, mobile: custMobile, email: custEmail, _id, resetUpdateCust, handleClose } = props
    const [ name, setName ] = useState(custName ? custName : '')
    const [ mobile, setMobile ] = useState(custMobile ? custMobile : '')
    const [ email, setEmail ] = useState(custEmail ? custEmail : '')
    const [ formErrors, setFormErrors ] = useState({})
    const [ loading, setLoading ] = useState(false)
    const errors = {}
    const dispatch = useDispatch()

    const handleChange = (e) => {
        if(e.target.name==='name') {
            setName(e.target.value)
        } else if(e.target.name==='mobile') {
            const val = e.target.value
            if(val === '' || /^\d{0,10}$/.test(val)) {
                setMobile(val)
            }
        } else if(e.target.name==='email') {
            setEmail(e.target.value.split(' ').join(''))
        }
    }

    const validate = () => {
        if(name.length===0){
            errors.name = "name can't be blank"
        }
        if(mobile.length !== 10){
            errors.mobile = "enter valid mobile number"
        }
        if(!validator.isEmail(email)){
            errors.email = 'enter valid email id'
        }
        setFormErrors(errors)
    }

    const resetForm = () => {
        setName('')
        setEmail('')
        setMobile('')
        if(handleClose){
            handleClose()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        validate()
        if(Object.keys(errors).length === 0){
            setLoading(true)
            const formData = {
                name: name.length > 0 ? name[0].toUpperCase() + name.slice(1) : name,
                mobile: mobile,
                email: email
            }
            try {
                if(_id) {
                    await dispatch(asyncUpdateCustomer(_id, formData, resetUpdateCust))
                } else {
                    await dispatch(asyncAddCustomer(formData, resetForm, handleClose))
                }
            } finally {
                setLoading(false)
            }
        }
    }

    return (
            <form autoComplete='off' onSubmit={handleSubmit}>
                <Box display='flex' flexDirection={handleClose ? 'column' : 'row'} flexWrap='wrap' gap={1}>
                    <TextField 
                        sx={formFieldSx}
                        name='name'
                        label='Name'
                        value={name}
                        onChange={handleChange}
                        error={formErrors.name ? true : false}
                        helperText={formErrors.name ? formErrors.name : null}
                        variant='outlined'
                        margin='dense'
                        disabled={loading}
                    />
                    <TextField 
                        sx={formFieldSx}
                        name='mobile'
                        label='Mobile'
                        value={mobile}
                        onChange={handleChange}
                        error={formErrors.mobile ? true : false}
                        helperText={formErrors.mobile ? formErrors.mobile : null}
                        variant='outlined'
                        margin='dense'
                        disabled={loading}
                    />
                    <TextField 
                        sx={formFieldSx}
                        name='email'
                        label='Email Id'
                        value={email}
                        onChange={handleChange}
                        error={formErrors.email ? true : false}
                        helperText={formErrors.email ? formErrors.email : null}
                        variant='outlined'
                        margin='dense'
                        disabled={loading}
                    />
                    {
                        _id ? (
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '8px' }}>
                                <Button 
                                    sx={{ minWidth: '80px', height: '40px', mt: '7px' }}
                                    type='submit'
                                    variant='contained' 
                                    color='primary'
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                >
                                    {loading ? 'Updating...' : 'Update'}
                                </Button>
                                <Button
                                    sx={{ minWidth: '80px', height: '40px', mt: '7px' }}
                                    variant='contained'
                                    color='secondary'
                                    onClick={resetUpdateCust}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '8px' }}>
                                    <Button 
                                        sx={{ minWidth: '80px', height: '40px', mt: '7px' }}
                                        type='submit' 
                                        variant='contained' 
                                        color='primary'
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                    >
                                        {loading ? 'Adding...' : 'Add'}
                                    </Button>
                                    {
                                        (name.length>0 || email.length>0 || mobile.length>0) && (
                                            <Button 
                                                sx={{ minWidth: '80px', height: '40px', mt: '7px' }}
                                                onClick = {resetForm} 
                                                variant='contained' 
                                                color='secondary'
                                                disabled={loading}
                                            >
                                                Cancel
                                            </Button>
                                        ) 
                                    }
                                </div>
                                
                        )  
                    }
                </Box>
                
            </form>
    )
}

export default CustomerForm
