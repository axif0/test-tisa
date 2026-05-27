import React, { useState, useEffect } from 'react'
import { Box, Container, Divider, Grid, TextField, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { asyncDeleteProducts, asyncGetProducts } from '../../action/productAction'
import AddProduct from './AddProduct'
import EditProduct from './EditProduct'
import ProductDetails from './ProductDetails'
import ProductTable from './ProductTable'

const ProductPage = (props) => {
    const products = useSelector(state => state.products)
    const dispatch = useDispatch()
    const [ updateProd, setUpdateProd ] = useState({})
    const [ viewProduct, setViewProduct ] = useState('')
    const [ search, setSearch ] = useState('')
    const [ productList, setProductList ] = useState(products)


    useEffect(() => {
        dispatch(asyncGetProducts())
    }, [dispatch])

    useEffect(() => {
        setProductList(products)
    }, [products])

    const handleUpdateProd = (data) => {
        setUpdateProd(data)
    }

    const resetUpdateProd = () => {
        setUpdateProd({})
    }

    const handleViewProduct = (data) => {
        setViewProduct(data)
    }
    
    const resetViewProduct = () => {
        setViewProduct('')
    }

    const handleDeleteProduct = (id) => {
        dispatch(asyncDeleteProducts(id))
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
        filterProducts(e.target.value)
    }

    const resetSearch = () => {
        setSearch('')
        filterProducts('')
    }

    const filterProducts = (value) => {
        if(value.length > 0) {
            const filteredProduct = products.filter(prod => (prod.name || '').toLowerCase().includes(value.toLowerCase()))
            setProductList(filteredProduct)
        } else {
            setProductList(products)
        }
    }

    return (
        <Container sx={{ width: '100%', padding: '2vh 2vw' }}>
            <Container disableGutters>
                <Typography sx={{ fontWeight: '700' }} variant='h3' >Products</Typography>
                {
                    Object.keys(updateProd).length > 0 ? (
                        <EditProduct updateProd={updateProd} resetUpdateProd={resetUpdateProd} />
                    ) : (
                        <AddProduct />
                    )
                }
                <Divider sx={{ width: '100%' }} />
            </Container>
                <Grid sx={{ width: '100%', mt: '2px' }} spacing={2} container disableGutters>
                    <Grid size={{ lg: 8, md: 8, sm: 12, xs: 12 }}>
                        <Box 
                            disableGutters 
                            display='flex' 
                            flexDirection='row' 
                            alignItems='baseline' 
                            justifyContent='space-between'
                            flexWrap='wrap'
                        >
                            <Typography variant='h5'>List of Products - {products.length} </Typography>
                            <TextField 
                                variant='outlined' 
                                margin='dense' 
                                label='search product'
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </Box>
                        <ProductTable 
                            products={productList}
                            resetSearch={resetSearch}
                            handleDeleteProduct={handleDeleteProduct} 
                            handleViewProduct={handleViewProduct}
                            handleUpdateProd={handleUpdateProd}
                        />
                    </Grid>
                    <Grid size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
                        <ProductDetails 
                            productId={viewProduct} 
                            resetViewProduct={resetViewProduct} 
                            handleUpdateProd={handleUpdateProd} 
                        />
                    </Grid>
                </Grid>
            </Container>
    )
}

export default ProductPage
