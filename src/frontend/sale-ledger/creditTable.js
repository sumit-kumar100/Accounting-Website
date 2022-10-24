import HighLight from 'react-highlighter'
import Receipt from './receivePayment'
import { Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material'
import { fDate } from '../../utils/formatTime'

const Debits = ({ credits, customersList, applyFilter, search, customer, setCustomer }) => {

  return (
    <div style={{ background: '#ffffff' }}>
      <Table size="small" >
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
          {credits?.map((row, index) => (
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
                    {row?.mode === 'CASH' ? 'By Cash' : 'By Bank'}
                  </HighLight>
                </Box>
              </TableCell>
              <TableCell align='center'>
                <Box width="120px">
                  <Receipt
                    names={customersList}
                    applyFilter={applyFilter}
                    row={row}
                    search={search}
                    customer={customer}
                    setCustomer={setCustomer}
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

export default Debits
