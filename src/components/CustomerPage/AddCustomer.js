import React from 'react'
import { Container, Typography } from '@mui/material'
import CustomerForm from './CustomerForm'

const AddCustomer = (props) => {

    return (
        <Container sx={{ padding: '10px 0' }}>
            <Typography sx={{ fontWeight: 700 }} variant='h5'>Add Customer</Typography>
            <CustomerForm />
        </Container>
    )
}

export default AddCustomer