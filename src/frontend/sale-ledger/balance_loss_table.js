import HighLight from 'react-highlighter'
import { Table, TableBody, TableCell, TableHead, TableRow, Box, TableContainer, Paper } from '@mui/material'
import { fDate } from '../../utils/formatTime'

const Account = ({ search, debits }) => (
    <TableContainer component={Paper} sx={{ marginTop: 5 }}>
        <Table>
            <TableHead sx={{ height: '45px' }}>
                <TableRow >
                    <TableCell align='center'>
                        Date
                    </TableCell>
                    <TableCell align='center'>
                        Details
                    </TableCell>
                    <TableCell align='center'>
                        Amount
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {debits?.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell align='center'>
                            <HighLight search={search}>
                                {`${fDate(row?._id)}`}
                            </HighLight>
                        </TableCell>
                        <TableCell align='center'>
                            <HighLight search={search}>
                                {row?.data?.map((balance, i) => (
                                    <Box key={i}>
                                        {`${balance.quantity} ${balance.details} ${balance.customer.split('-')[0]} ${"x"} ${balance.price}`}
                                    </Box>
                                ))}
                            </HighLight>
                        </TableCell>
                        <TableCell align='center'>
                             <HighLight search={search}>
                                {`₹ ${row?.data?.reduce((prev, curr) => prev + curr.total + curr.charges, 0)}`}
                            </HighLight> 
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
)

export default Account
