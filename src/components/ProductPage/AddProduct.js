import React from 'react'
import { Container, Typography } from '@mui/material'
import ProductForm from './ProductForm'

const AddProduct = (props) => {

    return (
        <Container sx={{ padding: '10px 0' }}>
            <Typography sx={{ fontWeight: 700 }} variant='h5'>Add Product</Typography>
            <ProductForm />
        </Container>
    )
}

export default AddProduct