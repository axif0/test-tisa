import { Grid } from '@mui/material'
import React from 'react'
import LineChart from './LineChart'
// eslint-disable-next-line no-unused-vars
import BarChart from './BarChart'

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
