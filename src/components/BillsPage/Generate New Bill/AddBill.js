import React, { useState } from 'react'
import { Container, Typography, Box, Grid } from '@mui/material'
import { useNavigate } from 'react-router'
import ProductSuggestion from './ProductSuggestion'
import ProductListTable from './ProductListTable'
import SummaryOfBill from './SummaryOfBill'
import AddCustomerModal from './AddCustomerModal'
import Swal from 'sweetalert2'

const AddBill = (props) => {
    const navigate = useNavigate()
    const [ lineItems, setLineItems ] = useState([])
    const [ customerInfo, setCustomerInfo ] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // functions related to lineitems
    const handleAddLineItem = (data) => {
        const newList = [...lineItems, data]
        setLineItems(newList)
    }

    const handleRemoveLineItem = (data) => {
        const newList = lineItems.filter(product => product._id !== data._id)
        setLineItems(newList)
    }

    const handleChangeQuantity = (data, type) => {
        if(type === 'add') {
            const newQuantityPlus = {...data, quantity: data.quantity + 1}
            newQuantityPlus.subTotal = newQuantityPlus.price * newQuantityPlus.quantity
            const newList = lineItems.map(product => {
                if(product._id === newQuantityPlus._id) {
                    return newQuantityPlus
                } else {
                    return product
                }
            })
            setLineItems(newList)
        } else if(type === 'minus') {
            const newQuantityMinus = {...data, quantity: data.quantity - 1}
            newQuantityMinus.subTotal = newQuantityMinus.price * newQuantityMinus.quantity
            const newList = lineItems.map(product => {
                if(product._id === newQuantityMinus._id) {
                    return newQuantityMinus
                } else {
                    return product
                }
            })
            setLineItems(newList)
        } else if(type === 'set') {
            // Handle direct quantity input
            const newList = lineItems.map(product => {
                if(product._id === data._id) {
                    return data
                } else {
                    return product
                }
            })
            setLineItems(newList)
        }
    }

    // function related to customerInfo
    const handleCustomerInfo = (value) => {
        setCustomerInfo(value)
    }

    const handleGenerateBillError = (error) => {
        const message = typeof error === 'string' ? error : (error?.message || 'Please check all required fields and try again')
        Swal.fire({
            icon: 'error',
            title: 'Bill Generation Failed',
            text: message,
        })
    }

    const handleBillSuccess = (billId) => {
        Swal.fire({
            icon: 'success',
            title: 'Bill Generated Successfully',
            showConfirmButton: false,
            timer: 1500
        })
        navigate(`/bills/${billId}`)
    }

    return (
        <Container sx={{ width: '100%', padding: '2vh 1vw' }}>
            <Box display='flex' flexDirection='row' justifyContent='space-between'>
                <Typography 
                    sx={{ fontWeight: '700' }} 
                    variant='h3'
                    sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' } }}
                >
                    New Bill
                </Typography>
                <AddCustomerModal />
            </Box>
            <Grid sx={{ minHeight: '60vh' }} container spacing={2}>
                <Grid size={{ lg: 9, md: 9, sm: 12, xs: 12 }}>
                    <ProductSuggestion handleAddLineItem={handleAddLineItem} />
                    <ProductListTable 
                        items={lineItems} 
                        handleChangeQuantity={handleChangeQuantity}
                        handleRemoveLineItem={handleRemoveLineItem}
                    />
                </Grid>
                <Grid size={{ lg: 3, md: 3, sm: 12, xs: 12 }}>
                    <SummaryOfBill 
                        handleCustomerInfo={handleCustomerInfo} 
                        lineItems={lineItems} 
                        customerInfo={customerInfo}
                        onGenerateError={handleGenerateBillError}
                        onGenerateSuccess={handleBillSuccess}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                </Grid>
            </Grid>
        </Container>
    )
}

export default AddBill