import React, { useState } from 'react'
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress } from '@mui/material'
import { englishToBengali } from '../../utils/bengaliNumerals'

const ProductTable = (props) => {
    const { handleDeleteProduct, handleViewProduct, handleUpdateProd, products, resetSearch } = props
    const [deletingId, setDeletingId] = useState(null)

    const onDelete = async (id) => {
        setDeletingId(id)
        try {
            await handleDeleteProduct(id)
            resetSearch()
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <TableContainer component={Paper} sx={{ maxHeight: '380px', overflow: 'auto' }}>
            <Table stickyHeader size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell align='center' sx={{ display: { xs: 'none', sm: 'table-cell' }, bgcolor: 'grey.900', color: 'common.white', position: 'sticky', top: 0, zIndex: 1 }}>ক্রমিক</TableCell>
                        <TableCell align='center' sx={{ width: '35%', bgcolor: 'grey.900', color: 'common.white', position: 'sticky', top: 0, zIndex: 1 }}>নাম</TableCell>
                        <TableCell align='center' sx={{ bgcolor: 'grey.900', color: 'common.white', position: 'sticky', top: 0, zIndex: 1 }}>দাম</TableCell>
                        <TableCell align='center' sx={{ bgcolor: 'grey.900', color: 'common.white', position: 'sticky', top: 0, zIndex: 1 }}>View</TableCell>
                        <TableCell align='center' sx={{ bgcolor: 'grey.900', color: 'common.white', position: 'sticky', top: 0, zIndex: 1 }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        products.map((prod, index) => {
                            const isDeleting = deletingId === prod._id;
                            return (
                                <TableRow hover key={prod._id} sx={{ opacity: isDeleting ? 0.5 : 1 }}>
                                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}> {englishToBengali(index + 1)} </TableCell>
                                    <TableCell> {prod.name} </TableCell>
                                    <TableCell> ৳{englishToBengali(prod.price)} </TableCell>
                                    <TableCell align='center'> 
                                        <Button 
                                            variant='contained'
                                            color='primary' 
                                            onClick={() => handleViewProduct(prod._id)}
                                            disabled={isDeleting}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                    <TableCell> 
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, justifyContent: 'center' }}>
                                            <Button 
                                                variant='contained'
                                                color='primary'
                                                onClick={() => {
                                                    handleUpdateProd(prod)
                                                    resetSearch()
                                                }}
                                                disabled={isDeleting}
                                            >
                                                Update
                                            </Button>
                                            <Button 
                                                variant='contained'
                                                color='secondary'   
                                                onClick={() => onDelete(prod._id)}
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

export default ProductTable
