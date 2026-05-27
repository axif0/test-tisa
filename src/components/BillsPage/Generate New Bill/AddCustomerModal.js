import React, { useState } from 'react'
import { Backdrop, Box, Button, Fade, Modal, Paper, Container, Typography } from '@mui/material'
import CustomerForm from '../../CustomerPage/CustomerForm'

const AddCustomerModal = (props) => {
    const [ open, setOpen ] = useState(false)

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Box>
            <Button
                variant='contained'
                color='primary'
                onClick={handleOpen}
            >
                Add New Customer
            </Button>
            <Modal
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Paper sx={{ width: { xs: '95%', sm: 'auto' }, maxWidth: 500, maxHeight: '90vh', overflow: 'auto' }}>
                        <Container sx={{ p: '20px 10px 20px 20px' }}>
                            <Typography sx={{ fontWeight: '600' }} align='center' variant='h5'>Add Customer</Typography>
                            <CustomerForm handleClose={handleClose}/>
                        </Container>  
                    </Paper>
                </Fade>
            </Modal>
        </Box>
    )
}

export default AddCustomerModal