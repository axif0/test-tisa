import React, { useState, useEffect, useMemo } from 'react'
import { Container, Typography, Box, TextField, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector, useDispatch } from 'react-redux'
import { asyncGetBills } from '../../action/billsAction'
import BillsTable from './BillsTable'
import SummarySection from './SummarySection'

const useStyle = makeStyles({
    title: {
        fontWeight: '700'
    },
    container: {
        width: '100%',
        padding: '2vh 2vw',
        marginLeft: '0',
    },
    searchField: {
        width: '35%',
        minWidth: '200px'
    },
    summarySection: {
        marginTop: '20px'
    },
    billTableSection: {
        width: '100%'
    }
})

const BillsPage = () => {
    const rawBills = useSelector(state => state.bills)
    const bills = useMemo(() => Array.isArray(rawBills) ? rawBills : [], [rawBills])
    const classes = useStyle()
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
            setAllBills(bills.filter(bill => bill._id.includes(val)))
        } else {
            setAllBills(bills)
        }
    }

    const resetSearch = () => {
        setSearch('')
        setAllBills(bills)
    }

    return (
        <Container className={classes.container}>
            <Grid container spacing={2}>
                <Grid className={classes.billTableSection} item lg={9} md={9} sm={12} xs={12}>
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
                            className={classes.title} 
                            variant='h3'
                            sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' } }}
                        >
                            Bills
                        </Typography>
                        <TextField 
                            className={classes.searchField}
                            variant='outlined'
                            label='search by order id'
                            margin='dense'
                            value={search}
                            onChange={handleSearch}
                        />
                    </Box>
                    { bills.length > 0 && <BillsTable bills={allBills} resetSearch={resetSearch} /> }
                </Grid>
                <Grid className={classes.summarySection} item lg={3} md={3} sm={12} xs={12}>
                    <SummarySection />        
                </Grid>
            </Grid>
        </Container>    
    )
}

export default BillsPage
