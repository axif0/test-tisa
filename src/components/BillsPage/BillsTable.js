import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, CircularProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { asyncDeleteBill, asyncGetBills } from '../../action/billsAction'
import moment from 'moment'
import Swal from 'sweetalert2'
import { formatLargeNumber } from '../../utils/bengaliNumerals'

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
    const [deletingId, setDeletingId] = useState(null)

    const reversedBills = Array.isArray(bills) ? [...bills].reverse() : []

    const getCustomerName = (customer) => {
        if (!customer) return 'Unknown Customer'
        if (typeof customer === 'object' && customer.name) {
            return customer.name
        }
        if (!customers || !Array.isArray(customers)) {
            return 'Loading...'
        }
        const customerId = typeof customer === 'object' ? customer._id : customer
        if (!customerId) return 'Unknown Customer'
        const customerData = customers.find(cust => cust._id === customerId)
        return customerData?.name || 'Customer Not Found'
    }

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete this bill?',
            text: 'This action cannot be undone',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete!'
        })
        
        if (result.isConfirmed) {
            setDeletingId(id)
            try {
                await dispatch(asyncDeleteBill(id))
                await dispatch(asyncGetBills())
                resetSearch()
            } catch (error) {
                console.error('Delete failed:', error)
                Swal.fire({ icon: 'error', title: 'Delete Failed', text: 'Failed to delete bill. Please try again.' })
            } finally {
                setDeletingId(null)
            }
        }
    }

    const formatAmount = (amount) => {
        if (!amount && amount !== 0) return '০';
        return `৳${formatLargeNumber(amount)}`;
    };

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
                        const isDeleting = deletingId === bill._id;
                        return (
                            <TableRow key={bill._id || 'temp-key'} sx={{ opacity: isDeleting ? 0.5 : 1 }}>
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
                                                disabled={isDeleting}
                                            >
                                                View
                                            </Button>
                                        </Link>
                                        <Button 
                                            size='small' 
                                            variant='contained' 
                                            color='secondary'
                                            onClick={() => handleDelete(bill._id)}
                                            disabled={isDeleting}
                                            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : null}
                                        >
                                            {isDeleting ? 'Deleting...' : 'Delete'}
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
