import React from 'react'
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { englishToBengali } from '../../utils/bengaliNumerals'

const useStyle = makeStyles({
    table: {
        maxHeight: '380px',
        overflow: 'auto'
    },
    nameHeader: {
        width: '35%'
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
    }
})

const ProductTable = (props) => {
    const { handleDeleteProduct, handleViewProduct, handleUpdateProd, products, resetSearch } = props
    const classes = useStyle()

    return (
        <TableContainer className={classes.table} component={Paper}>
            <Table stickyHeader size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeader} align='center' sx={{ display: { xs: 'none', sm: 'table-cell' }, bgcolor: 'grey.900', color: 'common.white' }}>ক্রমিক</TableCell>
                        <TableCell className={`${classes.nameHeader} ${classes.tableHeader}`} align='center' sx={{ bgcolor: 'grey.900', color: 'common.white' }}>নাম</TableCell>
                        <TableCell className={classes.tableHeader} align='center' sx={{ bgcolor: 'grey.900', color: 'common.white' }}>দাম</TableCell>
                        <TableCell className={classes.tableHeader} align='center' sx={{ bgcolor: 'grey.900', color: 'common.white' }}>View</TableCell>
                        <TableCell className={classes.tableHeader} align='center' sx={{ bgcolor: 'grey.900', color: 'common.white' }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        products.map((prod,index) => {
                            return (
                                <TableRow hover key={prod._id}>
                                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}> {englishToBengali(index + 1)} </TableCell>
                                    <TableCell> {prod.name} </TableCell>
                                    <TableCell> ৳{englishToBengali(prod.price)} </TableCell>
                                    <TableCell align='center'> 
                                        <Button 
                                            variant='contained'
                                            color='primary' 
                                            onClick={() => handleViewProduct(prod._id)}   
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
                                            >
                                                Update
                                            </Button>
                                            <Button 
                                                variant='contained'
                                                color='secondary'   
                                                onClick={() => {
                                                    handleDeleteProduct(prod._id)
                                                    resetSearch()
                                                }}
                                            >
                                                remove
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