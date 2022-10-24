import axios from 'axios'
import HighLight from 'react-highlighter'
import dynamic from 'next/dynamic'
import { Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material'
import { fDate } from '../../utils/formatTime'

const Charges = dynamic(() => import('../../components/charges'), { ssr: true })

const Credits = ({ search, credits, openingBalance, state, dispatch, actions, startDate, endDate }) => {

  const handleCharges = async charges => {

    const response = await axios.put(`/api/vendor/`,
      {
        _id: state.vendorLedgerData._id,
        credit: charges,
        updateName: false
      }
    )

    if (response?.data?.status) {

      const resp = await axios.post("/api/vendor/list",
        {
          aggregate: true,
          query: 'fetchPurchaseVendorLedger',
          startDate: startDate,
          endDate: endDate,
          name: state.vendorLedgerData.name
        }
      )

      await dispatch(actions.setVendorLedgerData(resp?.data?.data[0]))
    }
    return true
  }

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
          <TableRow>
            <TableCell align='center'><Box width="120px" /></TableCell>
            <TableCell align='center'>
              <Box width="120px">
                <HighLight search={search}>
                  {"Previous balances & losses"}
                </HighLight>
              </Box>
            </TableCell>
            <TableCell align='center'>
              <Box width="120px">
                <Charges
                  search={search}
                  additionalCost={openingBalance}
                  handleCharges={charges => handleCharges(charges)}
                />
              </Box>
            </TableCell>
          </TableRow>
          {credits?.map((row, index) => (
            <TableRow key={index}>
              <TableCell align='center'>
                <Box width="120px">
                  <HighLight search={search}>
                    {`${fDate(row?._id)}`}
                  </HighLight>
                </Box>
              </TableCell>
              <TableCell align='center'>
                <Box width="120px">
                  <HighLight search={search}>
                    By Purchases
                  </HighLight>
                </Box>
              </TableCell>
              <TableCell align='center'>
                <Box width="120px">
                  <HighLight search={search}>
                    {`₹ ${parseInt(row?.data?.reduce((prev, curr) => prev + curr.total + curr.charges, 0))}`}
                  </HighLight>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Credits
