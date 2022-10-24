import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { fDate } from '../../utils/formatTime'

const Filters = dynamic(() => import('../../components/filters'), { ssr: true })

const DataTable = dynamic(() => import('../../components/datatable'), { ssr: true })

const PaymentInformation = ({ paymentInfoModal, setPaymentInfoModal, vendorsList, user }) => {

    const [paymentInfoDetail, setPaymentInfoDetail] = useState([])

    const [vendor, setVendor] = useState(null)

    const [startDate, setStartDate] = useState(new Date())

    const [endDate, setEndDate] = useState(new Date())

    const Columns = [
        {
            name: 'S.No.',
            cell: (row, index) => (
                <Box>
                    {`${index + 1}`}
                </Box>
            )
        },
        {
            name: 'Date',
            cell: (row, index) => (
                <Box sx={{ minWidth: '80px' }}>
                    {`${fDate(row?.debit?.date)}`}
                </Box>
            )
        },
        {
            name: 'Amount(₹)',
            cell: (row, index) => (
                <Box>
                    {`₹ ${row?.debit?.amount}`}
                </Box>
            )
        },
    ]

    const getPaymentInfo = async () => {

        const response = await axios.post('/api/vendor/list/',
            {
                aggregate: true,
                query: "fetchPurchaseLedgerPayments",
                startDate: startDate,
                endDate: endDate,
                name: `${vendor}-${user?._id}`
            }
        )

        if (response?.data?.status) {
            setPaymentInfoDetail(response?.data?.data || [])
        }
    }

    return (
        <>
            <IconButton onClick={() => setPaymentInfoModal(false)} sx={{ position: 'absolute', top: 15, right: 10, cursor: 'pointer' }} >
                <CloseIcon />
            </IconButton>
            <Typography my={3} fontWeight="bold" textAlign="center">
                Payment Information
            </Typography>
            {paymentInfoModal ? (
                <Filters
                    device="desktop"
                    isLedgerFilter={true}
                    nameTag="Account"
                    buttonTag="Collect"
                    name={vendor}
                    setName={setVendor}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    names={vendorsList}
                    applyFilter={getPaymentInfo}
                />
            ) : null}
            <br />
            {paymentInfoDetail.length > 0 ? (
                <DataTable
                    size="medium"
                    columns={Columns}
                    data={paymentInfoDetail || []}
                />
            ) : (
                <Box textAlign="center" >
                    No Records To Display
                </Box>
            )}
        </>
    )
}


export default PaymentInformation