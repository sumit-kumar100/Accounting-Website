import HighLight from 'react-highlighter'
import dynamic from 'next/dynamic'
import { handleCreditCash } from './crud'
import { Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material'
import { fDate } from '../../utils/formatTime'

const Card = dynamic(() => import('./card'), { ssr: true })

const CreditTable = ({ state, search, startDate, endDate }) => {
    return (
        <div style={{ background: '#ffffff' }}>
            <Table size="small">
                <TableHead sx={{ height: '45px' }}>
                    <TableRow >
                        <TableCell align='center'>
                            <Box width="120px">
                                Date
                            </Box>
                        </TableCell>
                        <TableCell align='center'>
                            <Box width="120px">
                                Particulars
                            </Box>
                        </TableCell>
                        <TableCell align='center'>
                            <Box width="120px">
                                Amount
                            </Box>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {state?.cashPurchaseData?.map((purchase, index) => (
                        <TableRow key={index}>
                            <TableCell align='center'>
                                <Box width="120px">
                                    <HighLight search={search}>
                                        {`${fDate(purchase?.created_at)}`}
                                    </HighLight>
                                </Box>
                            </TableCell>
                            <TableCell align='center'>
                                <Box width="120px">
                                    <HighLight search={search}>
                                        {`By ${purchase?.vendor.split('-')[0]} ${purchase?.mode === 'BANK' ? "(Bank)" : ""}`}
                                    </HighLight>
                                </Box>
                            </TableCell>
                            <TableCell align='center'>
                                <Box width="120px" color='red'>
                                    <HighLight search={search}>
                                        {`₹ ${purchase?.total}`}
                                    </HighLight>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}

                    {state?.cashPaidData?.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell align='center'>
                                <Box width="120px">
                                    <HighLight search={search}>
                                        {`${fDate(row?.debit?.date)}`}
                                    </HighLight>
                                </Box>
                            </TableCell>
                            <TableCell align='center'>
                                <Box width="120px">
                                    <HighLight search={search}>
                                        {`By ${row?.name.split('-')[0]} ${row?.debit?.mode === 'BANK' ? "(Bank)" : ""}`}
                                    </HighLight>
                                </Box>
                            </TableCell>
                            <TableCell align='center'>
                                <Box width="120px" color='green'>
                                    <HighLight search={search}>
                                        {`₹ ${row?.debit?.amount}`}
                                    </HighLight>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                    {state?.userCashData[0]?.credits?.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell align='center'>
                                <Box width="120px">
                                    <HighLight search={search}>
                                        {`${fDate(row?.date)}`}
                                    </HighLight>
                                </Box>
                            </TableCell>
                            <TableCell align='center'>
                                <Box width="120px">
                                    <HighLight search={search}>
                                        {`By ${row?.information} ${row?.mode === 'BANK' ? "(Bank)" : ""}`}
                                    </HighLight>
                                </Box>
                            </TableCell>
                            <TableCell align='center'>
                                <Box width="120px">
                                    <Card
                                        search={search}
                                        handleCashSubmit={(data, row) => handleCreditCash(data, row, startDate, endDate)}
                                        row={row}
                                        credit={true}
                                    />
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CreditTable
