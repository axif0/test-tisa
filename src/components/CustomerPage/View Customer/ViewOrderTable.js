import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material'
import { englishToBengali } from '../../../utils/bengaliNumerals'

const ViewOrderTable = (props) => {
    const { lineItems, total } = props

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>ক্রমিক</TableCell>
                        <TableCell>পণ্যের নাম</TableCell>
                        <TableCell>দাম</TableCell>
                        <TableCell>পরিমাণ</TableCell>
                        <TableCell>মোট</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lineItems.map((item, index) => {
                        if (!item) return null;
                        const productName = typeof item.product === 'object' ? item.product?.name : 'Unknown Product';

                        return (
                            <TableRow key={item._id || index}>
                                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{englishToBengali(index + 1)}</TableCell>
                                <TableCell>{productName}</TableCell>
                                <TableCell>৳{englishToBengali(item.price)}</TableCell>
                                <TableCell>{englishToBengali(item.quantity)}</TableCell>
                                <TableCell>৳{englishToBengali(item.subTotal)}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4} sx={{ fontWeight: 600 }}>মোট টাকা</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>৳{englishToBengali(total)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default ViewOrderTable