import React from 'react'
import { Grid, Typography, Paper, Box } from '@mui/material'
import { useSelector } from 'react-redux'
import StatsItem from './StatsItem'
import moment from 'moment'
import { englishToBengali } from '../../utils/bengaliNumerals'

const StatsContainer = (props) => {
    const products = useSelector(state => state.products) || []
    const customers = useSelector(state => state.customers) || []
    const bills = useSelector(state => state.bills) || []

    const todayBills = Array.isArray(bills) ? bills.filter(bill => 
        moment(bill.createdAt).isBetween(moment().startOf('days'), moment(), null, '[]')
    ) : []

    const calculateTotal = (data) => {
        if (!Array.isArray(data)) return '০'
        const total = data.reduce((total, bill) => total + (bill.total || 0), 0)
        return englishToBengali(total)
    }

    // Calculate daily quantities for each product
    const getDailyProductQuantities = () => {
        const productQuantities = {};
        
        todayBills.forEach(bill => {
            if (!bill.items) return;
            
            bill.items.forEach(item => {
                if (!item.product || !item.quantity) return;
                
                const productId = typeof item.product === 'object' ? item.product._id : item.product;
                const productName = typeof item.product === 'object' ? item.product.name : 
                    products.find(p => p._id === productId)?.name || 'Unknown Product';
                
                if (!productQuantities[productId]) {
                    productQuantities[productId] = {
                        name: productName,
                        quantity: 0
                    };
                }
                productQuantities[productId].quantity += item.quantity;
            });
        });

        return Object.values(productQuantities);
    };

    const dailyProductStats = getDailyProductQuantities();

    return(
        <>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>Overall Stats</Typography>
            <Grid container spacing={{ xs: 2, md: 6 }}>
                <StatsItem statTitle={'মোট গ্রাহক'} statNumber={englishToBengali(customers.length)} />
                <StatsItem statTitle={'মোট পণ্য'} statNumber={englishToBengali(products.length)} />
                <StatsItem statTitle={'মোট অর্ডার'} statNumber={englishToBengali(bills.length)} />
            </Grid>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>Daily Stats</Typography>
            <Grid container spacing={{ xs: 2, md: 6 }}>
                <StatsItem statTitle={'আজকের বিল সংখ্যা'} statNumber={englishToBengali(todayBills.length)} />
                <StatsItem statTitle={'আজকের বিল'} statNumber={calculateTotal(todayBills)} />
                <StatsItem statTitle={'মোট বিল'} statNumber={calculateTotal(bills)} />
            </Grid>

            {/* Daily Product Quantities */}
            <Paper sx={{ mt: '20px', p: '15px' }}>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>আজকের বিক্রয়ের পরিমাণ</Typography>
                {dailyProductStats.length > 0 ? (
                    dailyProductStats.map((product, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', p: '8px 0', borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Typography>{product.name}</Typography>
                            <Typography>{englishToBengali(product.quantity)}</Typography>
                        </Box>
                    ))
                ) : (
                    <Typography align="center" sx={{ mt: '10px', color: 'text.secondary' }}>
                        আজ কোনো বিক্রয় হয়নি
                    </Typography>
                )}
            </Paper>
        </>
    )
}

export default StatsContainer