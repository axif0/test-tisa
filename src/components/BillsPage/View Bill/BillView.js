import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router'
import { Container, IconButton, Typography, Box, Tooltip, CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useDispatch } from 'react-redux'
import { asyncGetBillDetail } from '../../../action/billsAction'
import BillDetail from './BillDetail'
import BillItemtable from './BillItemTable'
import PrintBill from './PrintBill'

const containerSx = { width: '100%', padding: '2vh 1vw' }

const BillView = () => {
    const { id } = useParams()
    const [billDetails, setBillDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [customerAddress, setCustomerAddress] = useState('')
    const dispatch = useDispatch()

    const handleBillDetails = useCallback((data) => {
        if (data) {
            setBillDetails(data)
            setCustomerAddress(data.customer?.address || '')
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        let cancelled = false
        const fetchBillDetails = async () => {
            setIsLoading(true)
            setError(null)
            try {
                await dispatch(asyncGetBillDetail(id, (data) => {
                    if (!cancelled) handleBillDetails(data)
                }))
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'Failed to load bill details')
                    setIsLoading(false)
                }
            }
        }

        if (id) {
            fetchBillDetails()
        }
        return () => { cancelled = true }
    }, [dispatch, id, handleBillDetails])

    const handleAddressChange = (address) => {
        setCustomerAddress(address)
    }

    if (isLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <CircularProgress />
            </Container>
        )
    }

    if (error) {
        return (
            <Container sx={containerSx}>
                <Typography color="error" align="center">
                    {error}
                </Typography>
            </Container>
        )
    }

    if (!billDetails || !billDetails.items) {
        return (
            <Container sx={containerSx}>
                <Typography color="error" align="center">
                    Bill not found or has no items
                </Typography>
            </Container>
        )
    }

    return (
        <Container sx={containerSx}>
            <Box display='flex' flexDirection='row' justifyContent='space-between'>
                <Tooltip title='Go back to bills page'>
                    <Link to='/bills'>
                        <IconButton size='medium'>
                            <ArrowBackIcon />
                        </IconButton>
                    </Link>
                </Tooltip>
                <PrintBill 
                    id={id} 
                    bill={billDetails} 
                    customer={billDetails.customer}
                    customerAddress={customerAddress} 
                    items={billDetails.items || []} 
                />
            </Box>
            <Typography variant='h5' align='center'><strong>বিল ইনভয়েস</strong></Typography>
            <BillDetail 
                id={id} 
                bill={billDetails} 
                customer={billDetails.customer}
                onAddressChange={handleAddressChange}
            />
            {billDetails.items && billDetails.items.length > 0 && (
                <BillItemtable 
                    items={billDetails.items.map(item => ({
                        ...item,
                        product: item.product?._id || item.product,
                        name: item.product?.name || 'Unknown Product'
                    }))} 
                    total={billDetails.total} 
                />
            )}
        </Container>
    )
}

export default BillView
