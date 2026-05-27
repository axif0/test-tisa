import React, { useState, useEffect } from 'react'
import { Container, IconButton, CircularProgress, Box, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link, useParams } from 'react-router'
import CustomerStats from './CustomerStats'
import CustomerOrders from './CustomerOrders'
import { getData } from '../../../services/githubDB'

const containerSx = { width: '100%', padding: '2vh 1vw' }

const ViewCustomer = () => {
    const [customerData, setCustomerData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        let cancelled = false
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

                if (!cancelled) {
                    setCustomerData({
                        customer,
                        stats: {
                            totalOrders: customerBills.length,
                            totalAmount
                        },
                        bills: customerBills
                    })
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('Error fetching customer data:', err)
                    setError(err.message || 'Could not fetch customer data')
                }
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }

        fetchCustomerData()
        return () => { cancelled = true }
    }, [id])

    if (isLoading) {
        return (
            <Container sx={containerSx}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <CircularProgress />
                </Box>
            </Container>
        )
    }

    if (error) {
        return (
            <Container sx={containerSx}>
                <Typography color="error" variant="h6" align="center">
                    {error}
                </Typography>
            </Container>
        )
    }

    return (
        <Container sx={containerSx}>
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
