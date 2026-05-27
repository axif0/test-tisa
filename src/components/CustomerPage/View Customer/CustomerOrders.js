import React from 'react'
import { Typography, Container, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ViewOrderTable from './ViewOrderTable'
import moment from 'moment'

const accordionSx = {
    boxShadow: 'none',
    '&:not(:last-child)': { borderBottom: 0 },
    '&:before': { display: 'none' },
}

const CustomerOrders = (props) => {
    const { bills } = props

    return (
        <>
            <Typography variant='h5' align='center'>List of Orders - {bills.length}</Typography>
            {bills.map(bill => (
                    <Accordion 
                    key={bill._id}
                    sx={{ ...accordionSx, border: '1px solid', borderColor: 'divider' }}
                >
                    <AccordionSummary
                        sx={{ mb: -1, minHeight: 56, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}
                    >
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: { xs: 1, sm: 0 } }}>
                            <Typography component="span" variant='h6'>
                                {moment(bill.date || bill.createdAt).format('DD/MM/YYYY, hh:mm A')}
                            </Typography>
                            <Typography component="span" variant='h6'>
                                Order ID - {bill._id}
                            </Typography>
                            <Typography component="span" variant='h6'>
                                Total - ৳{bill.total}
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: '16px' }}>
                        <Container>
                            <ViewOrderTable lineItems={bill.items || []} total={bill.total} />
                        </Container>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    )
}

export default CustomerOrders