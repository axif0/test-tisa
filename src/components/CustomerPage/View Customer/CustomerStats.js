import React from 'react'
import { Container, Grid, Paper, Typography } from '@mui/material'

const CustomerStats = (props) => {
    const { customer, stats } = props

    if (!customer || !stats) {
        return null
    }

    return (
        <Grid container spacing={2}>
            <Grid size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
                <Paper sx={{ p: '16px 0' }}>
                    <Container>
                        <Typography variant='body1'><strong>Name: </strong>{customer.name}</Typography>
                        <Typography variant='body1'><strong>Email: </strong>{customer.email}</Typography>
                        <Typography variant='body1'><strong>Mobile: </strong>{customer.mobile}</Typography>
                    </Container>
                </Paper>
            </Grid>
            <Grid size={{ lg: 4, md: 4, sm: 6, xs: 6 }}>
                <Paper>
                    <Typography variant='h6' align='center'>Total Orders</Typography>
                    <Typography variant='h2' align='center' sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>{stats.totalOrders}</Typography>
                </Paper>
            </Grid>
            <Grid size={{ lg: 4, md: 4, sm: 6, xs: 6 }}>
                <Paper>
                    <Typography variant='h6' align='center'>Total Amount of Purchase</Typography>
                    <Typography variant='h2' align='center' sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>{stats.totalAmount}</Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default CustomerStats
