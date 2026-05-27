import React from 'react'
import { Container, Typography, Grid } from '@mui/material'
import StatsContainer from './StatsContainer'

const Dashboard = (props) => {

    return (
        <Container sx={{ width: '100%', padding: '2vh 1vw' }}>
            <Typography variant='h3' sx={{ fontWeight: '700' }}>Dashboard</Typography>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                    <StatsContainer />
                </Grid>
            </Grid>
        </Container>
    )
}

export default Dashboard
