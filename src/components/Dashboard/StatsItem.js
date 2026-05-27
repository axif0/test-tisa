import React from 'react'
import { Paper, Typography, Grid } from '@mui/material'

const StatsItem = (props) => {
    const { statTitle, statNumber } = props

    return (
        <Grid item lg={4} md={4} sm={4} xs={6}>
            <Paper elevation={2}>
                <Typography variant='h6' align='center'> {statTitle} </Typography>  
                <Typography variant='h2' align='center' sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}> {statNumber} </Typography>  
            </Paper>
        </Grid>
    )
}

export default StatsItem
