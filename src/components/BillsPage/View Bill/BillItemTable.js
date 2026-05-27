import React from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from '@mui/material'
import { englishToBengali } from '../../../utils/bengaliNumerals'

const headerFooterSx = { fontWeight: 600, fontSize: '0.875rem', position: 'sticky', top: 0, zIndex: 1 }

const BillItemtable = (props) => {
    const { items, total } = props

    return (
        <TableContainer component={Paper} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
            <Table size='small' stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ ...headerFooterSx, display: { xs: 'none', sm: 'table-cell' }, bgcolor: 'grey.900', color: 'common.white' }}>S.No</TableCell>
                        <TableCell sx={{ ...headerFooterSx, bgcolor: 'grey.900', color: 'common.white' }}><b>মালের নাম</b></TableCell>
                        <TableCell sx={{ ...headerFooterSx, bgcolor: 'grey.900', color: 'common.white' }}><b>দাম</b></TableCell>
                        <TableCell sx={{ ...headerFooterSx, bgcolor: 'grey.900', color: 'common.white' }}><b>পরিমান</b></TableCell>
                        <TableCell sx={{ ...headerFooterSx, bgcolor: 'grey.900', color: 'common.white' }}><b>মোট</b></TableCell>
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
                        <TableCell sx={{ ...headerFooterSx, bgcolor: 'grey.900', color: 'common.white' }}>মোট টাকা</TableCell>
                        <TableCell sx={{ ...headerFooterSx, bgcolor: 'grey.900', color: 'common.white' }}>
                            {englishToBengali(total)}
                        </TableCell>
                    </TableRow>   
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default BillItemtable