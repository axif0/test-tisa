import React, { useState, useEffect } from 'react'
import { Container, Typography, Box, Divider, TextField } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { asyncGetCustomers } from '../../action/customerAction'
import EditCustomer from './EditCustomer'
import AddCustomer from './AddCustomer'
import CustomerTable from './CustomerTable'

const CustomerPage = (props) => {
    const customers = useSelector(state => state.customers)
    const dispatch = useDispatch()
    const [ search, setSearch ] = useState('')
    const [ customerList, setCustomerList ] = useState(customers)
    const [ updateCust, setUpdateCust ] = useState({})

    useEffect(() => {
        setCustomerList(customers)
    }, [customers])

    useEffect(() => {
        dispatch(asyncGetCustomers())
    }, [dispatch])

    const filterCustomers = (value) => {
        if(value.length > 0) {
            const filteredCustomer = customers.filter(ele => {
                return (ele.name || '').toLowerCase().includes(value.toLowerCase()) || (ele.mobile || '').includes(value) || (ele.email || '').toLowerCase().includes(value.toLowerCase())
            })
            setCustomerList(filteredCustomer)
        } else {
            setCustomerList(customers)
        }
    } 

    const handleUpdateCustomer = (data) => {
        setUpdateCust(data)
    }

    const resetUpdateCust = () => {
        setUpdateCust({})
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
        filterCustomers(e.target.value)
    }

    const resetSearch = () => {
        setSearch('')
        filterCustomers('')
    }

    return (
        <Container sx={{ width: '100%', padding: '2vh 2vw', display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
            <Container disableGutters>
                <Typography sx={{ fontWeight: '700' }} variant='h3' >Customers</Typography>
                {
                    Object.keys(updateCust).length > 0 ? (
                        <EditCustomer updateCust={updateCust} resetUpdateCust={resetUpdateCust} />
                    ) : (
                        <AddCustomer />
                    )
                }
                <Divider sx={{ width: '100%' }} />
            </Container>
            
            <Box sx={{ mt: '20px' }}>
                    <Box 
                        disableGutters 
                        display='flex' 
                        flexDirection='row' 
                        alignItems='baseline' 
                        justifyContent='space-between' 
                        sx={{ width: '100%' }} 
                    >
                        <Typography variant='h5'>List of Customers - {customers.length}</Typography>
                        <TextField 
                            sx={{ minWidth: '200px' }} 
                            variant='outlined' 
                            margin='dense' 
                            value={search}
                            label='search customer by name, mobile or email' 
                            onChange={handleSearchChange}
                            sx={{ width: { xs: '100%', sm: '35%' } }}
                        />
                    </Box>
                <CustomerTable 
                    customers={customerList}
                    resetSearch={resetSearch}
                    handleUpdateCustomer={handleUpdateCustomer}
                />
            </Box>
        </Container>
    )
}

export default CustomerPage
