import { Button } from '@mui/material'
import moment from 'moment'
import React, { useRef } from 'react'
import html2pdf from 'html2pdf.js'
import GetAppIcon from '@mui/icons-material/GetApp'
import logo from '../../../images/tpp.jpg'
import { englishToBengali } from '../../../utils/bengaliNumerals'

const PrintBill = (props) => {
    const { customer, customerAddress, bill, id, items } = props
    const billRef = useRef(null)

    const generatePdf = () => {
        const element = billRef.current
        const opt = {
            margin: 10,
            filename: `${id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }

        html2pdf().from(element).set(opt).save()
    }

    const tableHeaderStyle = {
        padding: '10px 8px',
        border: '1px solid #bdc3c7',
        textAlign: 'left',
        fontSize: '13px',
        fontWeight: 'bold'
    }

    const tableCellStyle = {
        padding: '8px',
        border: '1px solid #bdc3c7',
        fontSize: '13px',
        verticalAlign: 'middle'
    }

    return (
        <>
            <Button
                variant='contained'
                color='primary'
                startIcon={<GetAppIcon />}
                onClick={generatePdf}
            >
                Download Bill
            </Button>

            {/* Hidden bill template - positioned off-screen for html2pdf to render */}
            <div style={{ 
                position: 'absolute', 
                left: '-9999px', 
                top: 0,
                width: '210mm'
            }}>
                <div ref={billRef} style={{ 
                    padding: '20px 25px',
                    fontFamily: 'Arial, sans-serif',
                    width: '100%',
                    boxSizing: 'border-box',
                    color: '#000',
                    backgroundColor: '#fff'
                }}>
                    {/* Watermark */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(-45deg)',
                        fontSize: '60px',
                        color: 'rgba(128, 128, 128, 0.10)',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        zIndex: 1,
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        TISHA PLASTIC
                    </div>

                    {/* Header */}
                    <table style={{ width: '100%', marginBottom: '15px', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td style={{ width: '110px', verticalAlign: 'middle', padding: '0' }}>
                                    <img src={logo} alt="Logo" style={{ 
                                        width: '100px', 
                                        height: '100px',
                                        objectFit: 'contain'
                                    }} />
                                </td>
                                <td style={{ verticalAlign: 'middle', textAlign: 'center', padding: '0' }}>
                                    <div style={{ 
                                        color: '#2c3e50', 
                                        fontSize: '28px',
                                        fontWeight: 'bold',
                                        letterSpacing: '0.5px',
                                        marginBottom: '6px'
                                    }}>TISHA PLASTIC PRODUCTS</div>
                                    <div style={{ 
                                        color: '#7f8c8d',
                                        fontSize: '13px',
                                        lineHeight: '1.4'
                                    }}>
                                        Address: 6/7/7/1, Champatoli Lane, Soyarighat, Dhaka<br/>
                                        Contact: 01744798523, 01325-418059
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Bill Title */}
                    <div style={{ 
                        backgroundColor: '#3498db', 
                        color: 'white', 
                        padding: '8px',
                        textAlign: 'center',
                        marginBottom: '15px'
                    }}>
                        <div style={{ 
                            margin: 0, 
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}>BILL</div>
                    </div>

                    {/* Bill Details */}
                    <table style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td style={{ verticalAlign: 'top', padding: '0', width: '50%' }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '14px' }}>Bill To:</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{customer?.name || ''}</div>
                                    <div style={{ fontSize: '13px', color: '#555' }}>{customerAddress}</div>
                                </td>
                                <td style={{ verticalAlign: 'top', padding: '0', textAlign: 'right', width: '50%' }}>
                                    <div style={{ fontSize: '13px', marginBottom: '2px' }}><strong>Invoice No:</strong> {id}</div>
                                    <div style={{ fontSize: '13px' }}><strong>Date:</strong> {moment(bill?.createdAt).format('DD/MM/YYYY')}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Items Table */}
                    <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse',
                        marginBottom: '20px'
                    }}>
                        <colgroup>
                            <col style={{ width: '8%' }} />
                            <col style={{ width: '37%' }} />
                            <col style={{ width: '18%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '22%' }} />
                        </colgroup>
                        <thead>
                            <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
                                <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>SL</th>
                                <th style={tableHeaderStyle}>মালের নাম</th>
                                <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>দাম</th>
                                <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>পরিমান</th>
                                <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>মোট</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => (
                                <tr key={i}>
                                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                                        {englishToBengali(i + 1)}
                                    </td>
                                    <td style={tableCellStyle}>{item.product?.name || item.name || ''}</td>
                                    <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                                        ৳{englishToBengali(item.price)}
                                    </td>
                                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                                        {englishToBengali(item.quantity)}
                                    </td>
                                    <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                                        ৳{englishToBengali(item.subTotal)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <td colSpan="4" style={{ ...tableCellStyle, textAlign: 'right', fontWeight: 'bold' }}>
                                    Total Amount:
                                </td>
                                <td style={{ ...tableCellStyle, textAlign: 'right', fontWeight: 'bold' }}>
                                    ৳{englishToBengali(bill?.total || 0)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Signatures */}
                    <table style={{ width: '100%', marginTop: '50px', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: 'center', padding: '0', width: '50%' }}>
                                    <div style={{ borderTop: '1px solid #000', width: '150px', margin: '0 auto 5px' }}></div>
                                    <div style={{ fontSize: '13px' }}>Customer's Signature</div>
                                </td>
                                <td style={{ textAlign: 'center', padding: '0', width: '50%' }}>
                                    <div style={{ borderTop: '1px solid #000', width: '150px', margin: '0 auto 5px' }}></div>
                                    <div style={{ fontSize: '13px' }}>Seller's Signature</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Footer */}
                    <div style={{ 
                        textAlign: 'center', 
                        marginTop: '30px',
                        color: '#7f8c8d',
                        fontSize: '12px'
                    }}>
                        Thank you for your business!
                    </div>
                </div>
            </div>
        </>
    )
}

export default PrintBill
