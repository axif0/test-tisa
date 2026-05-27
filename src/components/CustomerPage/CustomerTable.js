import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress } from '@mui/material'
import { asyncDeleteCustomer } from '../../action/customerAction'
import { makeStyles } from '@mui/styles'
import Swal from 'sweetalert2'

const useStyle = makeStyles({
    table: {
        width: '100%',
        marginTop: '5px',
        maxHeight: '60vh',
        overflow: 'auto'
    },
    nameColumn:{
        width: '25%'
    },
    emailColumn:{
        width: '25%'
    },
    tableBtns:{
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'space-evenly'
    },
    tableHeader: {
        position: 'sticky',
        top: 0,
        zIndex: 1
    },
    viewLink: {
        textDecoration: 'none'
    }
})

const CustomerTable = (props) => {
    const { handleUpdateCustomer, customers, resetSearch } = props
    const dispatch = useDispatch()
    const classes = useStyle()
    const [deletingId, setDeletingId] = useState(null)

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This customer will be removed',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete!'
        })
        
        if (result.isConfirmed) {
            setDeletingId(id)
            try {
                await dispatch(asyncDeleteCustomer(id))
                resetSearch()
            } finally {
                setDeletingId(null)
            }
        }
    }

    return (
        <TableContainer component={Paper} className={classes.table} >
            <Table stickyHeader size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeader} align='center' sx={{ display: { xs: 'none', sm: 'table-cell' }, bgcolor: 'grey.900', color: 'common.white' }}>ID</TableCell>
                        <TableCell className={`${classes.nameColumn} ${classes.tableHeader}`} align='center' sx={{ bgcolor: 'grey.900', color: 'common.white' }}>Customer Name</TableCell>
                        <TableCell className={classes.tableHeader} align='center' sx={{ bgcolor: 'grey.900', color: 'common.white' }}>Mobile</TableCell>
                        <TableCell className={`${classes.emailColumn} ${classes.tableHeader}`} align='center' sx={{ display: { xs: 'none', md: 'table-cell' }, bgcolor: 'grey.900', color: 'common.white' }}>Email</TableCell>
                        <TableCell className={classes.tableHeader} align='center' sx={{ bgcolor: 'grey.900', color: 'common.white' }}>View</TableCell>
                        <TableCell className={classes.tableHeader} align='center' sx={{ bgcolor: 'grey.900', color: 'common.white' }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        customers.map((cust, index) => {
                            const isDeleting = deletingId === cust._id;
                            return (
                                <TableRow hover key={cust._id} sx={{ opacity: isDeleting ? 0.5 : 1 }}>
                                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}> {index + 1} </TableCell>
                                    <TableCell> {cust.name} </TableCell>
                                    <TableCell> {cust.mobile} </TableCell>
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}> {cust.email} </TableCell>
                                    <TableCell align='center'> 
                                        <Link to={`/customers/${cust._id}`} className={classes.viewLink}>
                                            <Button
                                                variant='contained'
                                                color='primary'
                                                disabled={isDeleting}
                                            >
                                                View
                                            </Button>
                                        </Link> 
                                    </TableCell>
                                    <TableCell align='center'> 
                                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, justifyContent: 'center' }}>
                                                <Button
                                                    variant='contained'
                                                    color='primary'
                                                    onClick={() => {
                                                        handleUpdateCustomer(cust)
                                                        resetSearch()
                                                    }}
                                                    disabled={isDeleting}
                                                >
                                                    Update
                                                </Button> 
                                                <Button
                                                    variant='contained'
                                                    color='secondary'
                                                    onClick={() => handleDelete(cust._id)}
                                                    disabled={isDeleting}
                                                    startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : null}
                                                >
                                                    {isDeleting ? 'Removing...' : 'Remove'}
                                                </Button> 
                                            </Box>
                                        </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default CustomerTable
