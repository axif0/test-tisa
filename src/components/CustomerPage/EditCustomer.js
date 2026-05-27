import React from 'react'
import { Container, Typography } from '@mui/material'
import CustomerForm from './CustomerForm'

const EditCustomer = (props) => {
    const { updateCust, resetUpdateCust } = props

    return (
        <Container sx={{ padding: '10px 0' }}>
            <Typography sx={{ fontWeight: 700 }} variant='h5'>Edit Customer</Typography>
            <CustomerForm 
                name={updateCust.name}
                mobile={updateCust.mobile}
                email={updateCust.email}
                _id={updateCust._id}
                resetUpdateCust={resetUpdateCust}
            />
        </Container>
    )
}

export default EditCustomer