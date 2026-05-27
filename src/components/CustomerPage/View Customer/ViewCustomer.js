import React, { useState, useEffect } from 'react'
import { Container, IconButton, CircularProgress, Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link, useParams } from 'react-router-dom'
import CustomerStats from './CustomerStats'
import CustomerOrders from './CustomerOrders'
import { getData } from '../../../services/githubDB'

const useStyle = makeStyles({
    container: {
        width: '90vw',
        padding: '2vh 1vw'
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
    }
})

const ViewCustomer = () => {
    const classes = useStyle()
    const [customerData, setCustomerData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        const fetchCustomerData = async () => {
            setIsLoading(true)
            try {
                const [customers, bills] = await Promise.all([
                    getData('customers.json'),
                    getData('bills.json')
                ])

                const customer = customers.find(c => c._id === id)
                if (!customer) {
                    throw new Error('Customer not found')
                }

                const customerBills = bills.filter(b => {
                    if (!b.customer) return false
                    const customerId = typeof b.customer === 'object' ? b.customer._id : b.customer
                    return customerId === id
                })

                const totalAmount = customerBills.reduce((sum, bill) => sum + (Number(bill.total) || 0), 0)

                setCustomerData({
                    customer,
                    stats: {
                        totalOrders: customerBills.length,
                        totalAmount
                    },
                    bills: customerBills
                })
            } catch (err) {
                console.error('Error fetching customer data:', err)
                setError(err.message || 'Could not fetch customer data')
            } finally {
                setIsLoading(false)
            }
        }

        fetchCustomerData()
    }, [id])

    if (isLoading) {
        return (
            <Container className={classes.container}>
                <Box className={classes.loading}>
                    <CircularProgress />
                </Box>
            </Container>
        )
    }

    if (error) {
        return (
            <Container className={classes.container}>
                <Typography color="error" variant="h6" align="center">
                    {error}
                </Typography>
            </Container>
        )
    }

    return (
        <Container className={classes.container}>
            <Link to='/customers'>
                <IconButton size='medium'>
                    <ArrowBackIcon />
                </IconButton>
            </Link>
            <CustomerStats 
                customer={customerData?.customer}
                stats={customerData?.stats}
            />
            <CustomerOrders bills={customerData?.bills || []} />
        </Container>
    )
}

export default ViewCustomer
