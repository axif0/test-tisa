import React from 'react'
import { Container, Typography, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import StatsContainer from './StatsContainer'

const useStyle = makeStyles({
    container: {
        width: '100%',
        padding: '2vh 1vw'
    },
    title:{
        fontWeight: '700'
    }
})

const Dashboard = (props) => {
    const classes = useStyle()

    return (
        <Container className={classes.container}>
            <Typography variant='h3' className={classes.title} sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' } }}>Dashboard</Typography>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                    <StatsContainer />
                </Grid>
            </Grid>
        </Container>
    )
}

export default Dashboard
