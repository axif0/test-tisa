import React from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { englishToBengali } from '../../../utils/bengaliNumerals'

const useStyle = makeStyles({
    tableHeaderFooter: {
        fontWeight: 600,
        fontSize: '0.875rem',
        position: 'sticky',
        top: 0,
        zIndex: 1
    }
})

const BillItemtable = (props) => {
    const { items, total } = props
    const classes = useStyle()

    return (
        <TableContainer component={Paper} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
            <Table size='small' stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeaderFooter} sx={{ display: { xs: 'none', sm: 'table-cell' }, bgcolor: 'grey.100', color: 'text.primary' }}>S.No</TableCell>
                        <TableCell className={classes.tableHeaderFooter} sx={{ bgcolor: 'grey.100', color: 'text.primary' }}><b>মালের নাম</b></TableCell>
                        <TableCell className={classes.tableHeaderFooter} sx={{ bgcolor: 'grey.100', color: 'text.primary' }}><b>দাম</b></TableCell>
                        <TableCell className={classes.tableHeaderFooter} sx={{ bgcolor: 'grey.100', color: 'text.primary' }}><b>পরিমান</b></TableCell>
                        <TableCell className={classes.tableHeaderFooter} sx={{ bgcolor: 'grey.100', color: 'text.primary' }}><b>মোট</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{englishToBengali(index + 1)}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{englishToBengali(item.price)}</TableCell>
                            <TableCell>{englishToBengali(item.quantity)}</TableCell>
                            <TableCell>{englishToBengali(item.subTotal)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className={classes.tableHeaderFooter} sx={{ bgcolor: 'grey.100', color: 'text.primary' }}>মোট টাকা</TableCell>
                        <TableCell className={classes.tableHeaderFooter} sx={{ bgcolor: 'grey.100', color: 'text.primary' }}>
                            {englishToBengali(total)}
                        </TableCell>
                    </TableRow>   
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default BillItemtable