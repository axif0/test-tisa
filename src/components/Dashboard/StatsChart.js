import { Grid } from '@mui/material'
import React from 'react'
import LineChart from './LineChart'

const StatsChart = (props) => {

    return (
        <>
            <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <LineChart />
                </Grid>
            </Grid>
        </>
    )
}

export default StatsChart
