import * as React from 'react'
import HighLight from 'react-highlighter'
import dynamic from 'next/dynamic'
import { Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material'
import { fDate } from '../../utils/formatTime'

const Payment = dynamic(() => import('./addPayment'), { ssr: true })

const Debits = ({ debits, vendorsList, applyFilter, search, vendor, setVendor }) => {

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
          {debits?.map((row, index) => (
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
                    {row?.mode === 'CASH' ? 'To Cash' : 'To Bank'}
                  </HighLight>
                </Box>
              </TableCell>
              <TableCell align='center'>
                <Box width="120px">
                  <Payment
                    names={vendorsList}
                    applyFilter={applyFilter}
                    row={row}
                    search={search}
                    vendor={vendor}
                    setVendor={setVendor}
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
