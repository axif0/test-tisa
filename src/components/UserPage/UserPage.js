import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import { useSelector } from 'react-redux'

const UserPage = (props) => {
    const userDetails = useSelector(state => state.user)

    return (
        <Container maxWidth='sm'>
            <Box>
                <Typography variant='h3' align='center' sx={{ fontWeight: '600' }}>User Profile</Typography>
            </Box>
            <Box display='flex' flexDirection='row' flexWrap='wrap' justifyContent='space-evenly' alignItems='center' minHeight='50vh'>
                <Box>
                    <Typography variant='h5' sx={{ fontWeight: '700', fontSize: { xs: '1rem', sm: '1.25rem' } }}>Name: </Typography>
                    <Typography variant='h5' sx={{ fontWeight: '700', fontSize: { xs: '1rem', sm: '1.25rem' } }}>Email: </Typography>
                    <Typography variant='h5' sx={{ fontWeight: '700', fontSize: { xs: '1rem', sm: '1.25rem' } }}>Business Name: </Typography>
                    <Typography variant='h5' sx={{ fontWeight: '700', fontSize: { xs: '1rem', sm: '1.25rem' } }}>Address: </Typography>
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
