import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector } from 'react-redux'

const useStyle = makeStyles({
    title: {
        fontWeight: '600'
    },
    keys:{
        fontWeight:'700'
    }
})

const UserPage = (props) => {
    const userDetails = useSelector(state => state.user)
    const classes = useStyle()

    return (
        <Container maxWidth='sm'>
            <Box>
                <Typography className={classes.title} variant='h3' align='center' sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' } }}>User Profile</Typography>
            </Box>
            <Box display='flex' flexDirection='row' flexWrap='wrap' justifyContent='space-evenly' alignItems='center' minHeight='50vh'>
                <Box>
                    <Typography className={classes.keys} variant='h5' sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Name: </Typography>
                    <Typography className={classes.keys} variant='h5' sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Email: </Typography>
                    <Typography className={classes.keys} variant='h5' sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Business Name: </Typography>
                    <Typography className={classes.keys} variant='h5' sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Address: </Typography>
                </Box>
                <Box>
                    <Typography variant='h5' sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{userDetails.username || '-'}</Typography>
                    <Typography variant='h5' sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{userDetails.email || '-'}</Typography>
                    <Typography variant='h5' sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{userDetails.businessName || '-'}</Typography>
                    <Typography variant='h5' sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{userDetails.address || '-'}</Typography>
                </Box>
            </Box>            
        </Container>
    )
}

export default UserPage
