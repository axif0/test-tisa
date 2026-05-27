import React from 'react'
import { Container, Typography } from '@mui/material'
import ProductForm from './ProductForm'

const EditProduct = (props) => {
    const { updateProd, resetUpdateProd } = props

    return (
        <Container sx={{ padding: '10px 0' }}>
            <Typography sx={{ fontWeight: 700 }} variant='h5'>Edit Product</Typography>
            <ProductForm
                name={updateProd.name}
                price={updateProd.price}     
                _id={updateProd._id}  
                resetUpdateProd={resetUpdateProd}     
            />
        </Container>
    )
}

export default EditProduct