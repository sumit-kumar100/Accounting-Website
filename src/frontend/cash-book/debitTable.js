import HighLight from 'react-highlighter'
import dynamic from 'next/dynamic'
import { handleDebitCash } from './crud'
import { Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material'
import { fDate } from '../../utils/formatTime'

const Card = dynamic(() => import('./card'), { ssr: true })

const DebitTable = ({ state, search, startDate, endDate }) => {
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
                    {state?.cashSaleData?.map(({ sales }, index) => (
                        <TableRow key={index}>
                            <TableCell align='center'>
                                <Box width="120px">
                                    <HighLight search={search}>
                                        {`${fDate(sales?.created_at)}`}
                                    </HighLight>
                                </Box>
                            </TableCell>
                            <TableCell align='center'>
                                <Box width="120px">
                                    <HighLight search={search}>
                                        {`To ${sales?.customer.split('-')[0]} ${sales?.mode === 'BANK' ? "(Bank)" : ""}`}
                                    </HighLight>
                                </Box>
                            </TableCell>
                            <TableCell align='center'>
                                <Box width="120px" color="red">
                                    <HighLight search={search}>
                                        {`₹ ${sales?.total}`}
                                    </HighLight>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                    {state?.cashReceiveData?.map(({ credit, name }, index) => (
                        <TableRow key={index}>
                            <TableCell align='center'>
                                <Box width="120px">
                                    <HighLight search={search}>
                                        {`${fDate(credit?.date)}`}
                                    </HighLight>
                                </Box>
                            </TableCell>
                            <TableCell align='center'>
                                <Box width="120px">
                                    <HighLight search={search}>
                                        {`To ${name.split('-')[0]} ${credit?.mode === 'BANK' ? "(Bank)" : ""}`}
                                    </HighLight>
                                </Box>
                            </TableCell>
                            <TableCell align='center'>
                                <Box width="120px" color="green">
                                    <HighLight search={search}>
                                        {`₹ ${credit?.amount}`}
                                    </HighLight>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                    {state?.userCashData[0]?.debits?.map((row, index) => (
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
                                        {`To ${row?.information} ${row?.mode === 'BANK' ? "(Bank)" : ""}`}
                                    </HighLight>
                                </Box>
                            </TableCell>
                            <TableCell align='center'>
                                <Box width="120px" >
                                    <Card
                                        search={search}
                                        handleCashSubmit={(data, row) => handleDebitCash(data, row, startDate, endDate)}
                                        row={row}
                                        debit={true}
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

export default DebitTable
