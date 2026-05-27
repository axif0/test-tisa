import React from 'react'
import { Link } from 'react-router'
import { Box, Typography, Paper, Divider, Fab, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useSelector } from 'react-redux'
import { formatLargeNumber } from '../../utils/bengaliNumerals'

const SummarySection = (props) => {
    const bills = useSelector(state => state.bills)

    const calculateTotal = (data) => {
        if (!Array.isArray(data)) return '০';
        const total = data.reduce((sum, bill) => sum + (Number(bill.total) || 0), 0);
        return `৳${formatLargeNumber(total)}`;
    }

    return (
        <Box 
            sx={{ height: 'auto' }}
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
        >
            <Box>
                <Paper sx={{ minHeight: '150px' }}>
                    <Typography sx={{ textAlign: 'center', fontWeight: 600 }} variant='h5'>Summary</Typography>
                    <Divider variant='middle' />
                    <Box sx={{ p: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }} display='block'>
                        <Typography variant='h6'>মোট অর্ডার: {formatLargeNumber(bills.length)}</Typography>
                        <Typography variant='h6'>মোট টাকা: {calculateTotal(bills)}</Typography>
                    </Box>
                </Paper>
            </Box>
            
                <Link to='/addBill'>
                    <Tooltip title='Add New Bill'>
                        <Fab color='primary' sx={{ position: 'fixed', bottom: { xs: 16, sm: 50 }, right: { xs: 16, sm: 60 } }}>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                </Link>
        </Box>
    )
}

export default SummarySection
