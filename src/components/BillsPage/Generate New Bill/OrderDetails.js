import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import { englishToBengali } from '../../../utils/bengaliNumerals'

const OrderDetails = (props) => {
    const { lineItems } = props

    const calculateTotal = (data) => {
        let total = 0
        data.forEach(ele => total = total + (ele.subTotal || 0))
        return englishToBengali(total)
    }

    return (
        <Container>
            <Box sx={{ mt: '15px' }}>
                <Box display='flex' flexDirection='row' justifyContent='space-around'>
                    <Typography variant='body1'><strong>মোট পণ্য:</strong></Typography>
                    <Typography variant='body1'>{englishToBengali(lineItems.length)}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' alignItems='center'>
                    <Typography variant='body1'><strong>মোট টাকা:</strong></Typography>               
                    <Typography variant='h2' align='center' sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>৳{calculateTotal(lineItems)}</Typography>
                </Box>
            </Box>
        </Container>
    )
}

export default OrderDetails