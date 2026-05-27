import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { asyncDeleteBill, asyncGetBills } from '../../action/billsAction'
import { asyncGetCustomers } from '../../action/customerAction'
import moment from 'moment'
import Swal from 'sweetalert2'
import { englishToBengali, formatLargeNumber } from '../../utils/bengaliNumerals'

const useStyle = makeStyles({
    table: {
        position: 'relative',
        width: '100%',
        marginTop: '5px',
        maxHeight: '70vh',
        overflow: 'auto'
    },
    tableHeader: {
        position: 'sticky',
        top: 0,
        zIndex: 1
    },
    viewLink: {
        textDecoration: 'none'
    },
    actionCell: {
        display: 'flex',
        gap: '8px'
    }
})

const BillsTable = (props) => {
    const dispatch = useDispatch()
    const { bills, resetSearch } = props
    const customers = useSelector(state => state.customers)
    const classes = useStyle()

    // Load customers when component mounts
    useEffect(() => {
        dispatch(asyncGetCustomers())
    }, [dispatch])

    // Create a safe copy of bills array before reversing
    const reversedBills = Array.isArray(bills) ? [...bills].reverse() : []

    const getCustomerName = (customer) => {
        // Early return if customer is null/undefined
        if (!customer) return 'Unknown Customer'
        
        // If customer is already an object with name, use that
        if (typeof customer === 'object' && customer.name) {
            return customer.name
        }

        // If customers array is not ready yet
        if (!customers || !Array.isArray(customers)) {
            return 'Loading...'
        }

        // If customer is an ID, find the customer
        const customerId = typeof customer === 'object' ? customer._id : customer
        if (!customerId) return 'Unknown Customer'

        const customerData = customers.find(cust => cust._id === customerId)
        return customerData?.name || 'Customer Not Found'
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete this bill?',
            text: 'This action cannot be undone',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(asyncDeleteBill(id))
                    .then(() => {
                        dispatch(asyncGetBills())
                        resetSearch()
                    })
                    .catch(error => {
                        console.error('Delete failed:', error)
                        Swal.fire({ icon: 'error', title: 'Delete Failed', text: 'Failed to delete bill. Please try again.' })
                    })
            }
        })
    }

    const formatAmount = (amount) => {
        if (!amount && amount !== 0) return '০';
        return `৳${formatLargeNumber(amount)}`;
    };

    // Add validation for bills data
    if (!Array.isArray(bills) || bills.length === 0) {
        return (
            <TableContainer component={Paper} className={classes.table}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHeader} colSpan={5} align="center">
                                No bills found
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        )
    }

    return (
        <TableContainer component={Paper} className={classes.table}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeader} sx={{ bgcolor: 'grey.900', color: 'common.white' }}>তারিখ</TableCell>
                        <TableCell className={classes.tableHeader} sx={{ display: { xs: 'none', sm: 'table-cell' }, bgcolor: 'grey.900', color: 'common.white' }}>অর্ডার আইডি</TableCell>
                        <TableCell className={classes.tableHeader} sx={{ bgcolor: 'grey.900', color: 'common.white' }}>গ্রাহকের নাম</TableCell>
                        <TableCell className={classes.tableHeader} sx={{ bgcolor: 'grey.900', color: 'common.white' }}>মোট টাকা</TableCell>
                        <TableCell className={classes.tableHeader} sx={{ bgcolor: 'grey.900', color: 'common.white' }}>অ্যাকশন</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reversedBills.map(bill => {
                        if (!bill) return null;
                        const customerName = getCustomerName(bill.customer);
                        return (
                            <TableRow key={bill._id || 'temp-key'}>
                                <TableCell>{moment(bill.date).format('DD/MM/YYYY, hh:mm A')}</TableCell>
                                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{bill._id}</TableCell>
                                <TableCell>{customerName}</TableCell>
                                <TableCell>{formatAmount(bill.total)}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                                        <Link to={`/bills/${bill._id}`} className={classes.viewLink}>
                                            <Button 
                                                size='small' 
                                                variant='contained' 
                                                color='primary'
                                            >
                                                View
                                            </Button>
                                        </Link>
                                        <Button 
                                            size='small' 
                                            variant='contained' 
                                            color='secondary'
                                            onClick={() => handleDelete(bill._id)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default BillsTable