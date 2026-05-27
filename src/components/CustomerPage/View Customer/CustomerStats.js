import React from 'react'
import { Container, Grid, Paper, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
 
const useStyle = makeStyles({
    custDetail: {
        padding: '16px 0'
    }
})

const CustomerStats = (props) => {
    const { customer, stats } = props
    const classes = useStyle()

    if (!customer || !stats) {
        return null
    }

    return (
        <Grid container spacing={2}>
            <Grid item lg={4} md={4} sm={12} xs={12}>
                <Paper className={classes.custDetail}>
                    <Container>
                        <Typography variant='body1'><strong>Name: </strong>{customer.name}</Typography>
                        <Typography variant='body1'><strong>Email: </strong>{customer.email}</Typography>
                        <Typography variant='body1'><strong>Mobile: </strong>{customer.mobile}</Typography>
                    </Container>
                </Paper>
            </Grid>
            <Grid item lg={4} md={4} sm={6} xs={6}>
                <Paper>
                    <Typography variant='h6' align='center'>Total Orders</Typography>
                    <Typography variant='h2' align='center' sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>{stats.totalOrders}</Typography>
                </Paper>
            </Grid>
            <Grid item lg={4} md={4} sm={6} xs={6}>
                <Paper>
                    <Typography variant='h6' align='center'>Total Amount of Purchase</Typography>
                    <Typography variant='h2' align='center' sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>{stats.totalAmount}</Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default CustomerStats