import React from 'react'
import { Link } from 'react-router'
import { Box, Typography, Paper, Divider, Fab, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import AddIcon from '@mui/icons-material/Add'
import { useSelector } from 'react-redux'
import { formatLargeNumber } from '../../utils/bengaliNumerals'

const useStyle = makeStyles({
    summaryTitle:{
        textAlign: 'center',
        fontWeight: 600
    },
    summaryContainer:{
        minHeight: '150px'
    },
    summaryContent:{
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent:'space-evenly'
    },
    summary:{
        height: 'auto'
    },
    addIcon:{
        position: 'fixed'
    }
})

const SummarySection = (props) => {
    const classes = useStyle()
    const bills = useSelector(state => state.bills)

    const calculateTotal = (data) => {
        if (!Array.isArray(data)) return '০';
        const total = data.reduce((sum, bill) => sum + (Number(bill.total) || 0), 0);
        return `৳${formatLargeNumber(total)}`;
    }

    return (
        <Box 
            className={classes.summary}
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
        >
            <Box>
                <Paper className={classes.summaryContainer}>
                    <Typography className={classes.summaryTitle} variant='h5'>Summary</Typography>
                    <Divider variant='middle' />
                    <Box className={classes.summaryContent} display='block'>
                        <Typography variant='h6'>মোট অর্ডার: {formatLargeNumber(bills.length)}</Typography>
                        <Typography variant='h6'>মোট টাকা: {calculateTotal(bills)}</Typography>
                    </Box>
                </Paper>
            </Box>
            
                <Link to='/addBill'>
                    <Tooltip title='Add New Bill'>
                        <Fab className={classes.addIcon} color='primary' sx={{ bottom: { xs: 16, sm: 50 }, right: { xs: 16, sm: 60 } }}>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                </Link>
        </Box>
    )
}

export default SummarySection
