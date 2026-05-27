import React, { useState, useEffect } from 'react'
import { Typography, Paper, Box, Button, Accordion, AccordionSummary, AccordionDetails, Container } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useDispatch } from 'react-redux'
import { asyncDeleteProducts } from '../../action/productAction'
import moment from 'moment'
import { getData } from '../../services/githubDB'
import { englishToBengali } from '../../utils/bengaliNumerals'

const useStyle = makeStyles({
    container: {
        width: '100%',
        maxWidth: '400px',
        padding: '20px',
        maxHeight: '80vh',
        overflowY: 'auto'
    },
    content: {
        marginTop: '20px'
    },
    noProduct: {
        width: '150px',
        wordBreak: 'break-word'
    },
    detailsTitle: {
        textAlign: 'center',
        fontWeight: 600,
        marginBottom: '20px'
    },
    statsContainer: {
        marginTop: '20px',
        marginBottom: '20px'
    },
    statsBox: {
        padding: '15px',
        marginBottom: '10px',
        borderRadius: '4px'
    },
    ordersList: {
        marginTop: '20px'
    },
    accordion: {
        marginBottom: '8px'
    }
})

const ProductDetails = (props) => {
    const { productId, resetViewProduct, handleUpdateProd } = props
    const classes = useStyle()
    const [productData, setProductData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchProductData = async () => {
            if (!productId) return
            setIsLoading(true)
            try {
                const [products, bills] = await Promise.all([
                    getData('products.json'),
                    getData('bills.json')
                ])

                const product = products.find(p => p._id === productId)
                if (!product) {
                    throw new Error('Product not found')
                }

                const productBills = bills.filter(bill => {
                    if (!bill.items || !Array.isArray(bill.items)) return false
                    return bill.items.some(item => {
                        const itemProductId = item.product?._id || item.product
                        return itemProductId === productId
                    })
                }).map(bill => {
                    const relevantItems = bill.items.filter(item => {
                        const itemProductId = item.product?._id || item.product
                        return itemProductId === productId
                    })
                    return { ...bill, items: relevantItems }
                })

                const totalOrders = productBills.length
                const totalQuantity = productBills.reduce((sum, bill) => {
                    return sum + bill.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0)
                }, 0)
                const totalAmount = productBills.reduce((sum, bill) => {
                    return sum + bill.items.reduce((itemSum, item) => itemSum + (item.subTotal || 0), 0)
                }, 0)

                setProductData({
                    product,
                    stats: { totalOrders, totalQuantity, totalAmount },
                    bills: productBills
                })
            } catch (err) {
                console.error('Error fetching product data:', err)
                setError(err.message || 'Could not fetch product data')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProductData()
    }, [productId])

    const handleRemove = (id) => {
        dispatch(asyncDeleteProducts(id))
        resetViewProduct()
    }

    const handleClose = () => {
        setProductData(null)
        resetViewProduct()
    }

    if (!productId) {
        return (
            <Paper className={classes.container}>
                <Typography className={classes.noProduct} variant='h6' sx={{ color: 'text.secondary' }}>
                    Select a product to view its details
                </Typography>
            </Paper>
        )
    }

    if (isLoading) {
        return (
            <Paper className={classes.container}>
                <Typography>Loading...</Typography>
            </Paper>
        )
    }

    if (error) {
        return (
            <Paper className={classes.container}>
                <Typography color="error">{error}</Typography>
            </Paper>
        )
    }

    if (!productData) return null

    return (
        <Paper className={classes.container}>
            <Typography className={classes.detailsTitle} variant='h5'>Product Details</Typography>
            
            <Box className={classes.content}>
                <Typography variant='h6'>নাম: {productData?.product?.name}</Typography>
                <Typography variant='h6'>দাম: ৳{englishToBengali(productData?.product?.price)}</Typography>
                <Typography variant='subtitle1'>
                    Added on: {productData?.product?.createdAt ? 
                        moment(productData.product.createdAt).format('DD/MM/YYYY, hh:mm A') : 
                        'N/A'}
                </Typography>
            </Box>

            <Box className={classes.statsContainer}>
                <Paper className={classes.statsBox} sx={{ bgcolor: 'grey.100' }}>
                    <Typography variant='h6' align='center'>মোট অর্ডার</Typography>
                    <Typography variant='h4' align='center'>
                        {englishToBengali(productData?.stats?.totalOrders || 0)}
                    </Typography>
                </Paper>
                <Paper className={classes.statsBox} sx={{ bgcolor: 'grey.100' }}>
                    <Typography variant='h6' align='center'>মোট বিক্রয়</Typography>
                    <Typography variant='h4' align='center'>
                        {englishToBengali(productData?.stats?.totalQuantity || 0)}
                    </Typography>
                </Paper>
                <Paper className={classes.statsBox} sx={{ bgcolor: 'grey.100' }}>
                    <Typography variant='h6' align='center'>মোট আয়</Typography>
                    <Typography variant='h4' align='center'>
                        ৳{englishToBengali(productData?.stats?.totalAmount || 0)}
                    </Typography>
                </Paper>
            </Box>

            <Box className={classes.ordersList}>
                <Typography variant='h6'>Order History</Typography>
                {productData?.bills?.length > 0 ? (
                    productData.bills.map((bill) => {
                        if (!bill?.customer || !bill?.items?.[0]) return null;
                        
                        return (
                            <Accordion key={bill._id} className={classes.accordion}>
                                <AccordionSummary>
                                    <Box width='100%' display='flex' flexDirection='row' justifyContent='space-between'>
                                        <Typography>{bill.customer.name || 'Unknown Customer'}</Typography>
                                        <Typography>Qty: {englishToBengali(bill.items[0].quantity || 0)}</Typography>
                                        <Typography>৳{englishToBengali(bill.items[0].subTotal || 0)}</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box>
                                        <Typography>
                                            <strong>Order Date:</strong> {bill.date ? 
                                                moment(bill.date).format('DD/MM/YYYY, hh:mm A') : 
                                                'N/A'}
                                        </Typography>
                                        <Typography>
                                            <strong>Customer Email:</strong> {bill.customer.email || 'N/A'}
                                        </Typography>
                                        <Typography>
                                            <strong>Customer Mobile:</strong> {bill.customer.mobile || 'N/A'}
                                        </Typography>
                                        <Typography>
                                            <strong>Unit Price:</strong>  ৳{englishToBengali(bill.items[0].price || 0)}
                                        </Typography>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })
                ) : (
                    <Typography color="textSecondary" align="center">
                        No orders found for this product
                    </Typography>
                )}
            </Box>

            <Box display='flex' justifyContent='space-around' mt={3}>
                <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => handleRemove(productData?.product?._id)}
                >
                    Remove
                </Button>
                <Button
                    variant='contained'
                    onClick={handleClose}
                >
                    Close
                </Button>
            </Box>
        </Paper>
    )
}

export default ProductDetails
