import React, { useState, useEffect, useMemo } from 'react'
import { Container, Typography, Box, TextField, Grid } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { asyncGetBills } from '../../action/billsAction'
import BillsTable from './BillsTable'
import SummarySection from './SummarySection'

const BillsPage = () => {
    const rawBills = useSelector(state => state.bills)
    const bills = useMemo(() => Array.isArray(rawBills) ? rawBills : [], [rawBills])
    const dispatch = useDispatch()
    const [ search, setSearch ] = useState('')
    const [ allBills, setAllBills ] = useState([])

    useEffect(() => {
        dispatch(asyncGetBills())
    }, [dispatch])

    useEffect(() => {
        setAllBills(Array.isArray(bills) ? bills : [])
    }, [bills])

    const handleSearch = (e) => {
        const val = e.target.value
        setSearch(val)
        if (val.length > 0) {
            setAllBills(bills.filter(bill => bill._id?.includes(val)))
        } else {
            setAllBills(bills)
        }
    }

    const resetSearch = () => {
        setSearch('')
        setAllBills(bills)
    }

    return (
        <Container sx={{ width: '100%', padding: '2vh 2vw' }}>
            <Grid container spacing={2}>
                <Grid sx={{ width: '100%' }} size={{ lg: 9, md: 9, sm: 12, xs: 12 }}>
                    <Box 
                        display='flex'
                        flexDirection='row'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={2}
                        flexWrap='wrap'
                        gap={1}
                    >
                        <Typography 
                            sx={{ fontWeight: '700' }} 
                            variant='h3'
                        >
                            Bills
                        </Typography>
                        <TextField 
                            sx={{ width: '35%', minWidth: '200px' }}
                            variant='outlined'
                            label='search by order id'
                            margin='dense'
                            value={search}
                            onChange={handleSearch}
                        />
                    </Box>
                    { bills.length > 0 && <BillsTable bills={allBills} resetSearch={resetSearch} /> }
                </Grid>
                <Grid sx={{ mt: '20px' }} size={{ lg: 3, md: 3, sm: 12, xs: 12 }}>
                    <SummarySection />        
                </Grid>
            </Grid>
        </Container>    
    )
}

export default BillsPage
