import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { fDate } from '../../utils/formatTime'

const Filters = dynamic(() => import('../../components/filters'), { ssr: true })

const DataTable = dynamic(() => import('../../components/datatable'), { ssr: true })

const ReceiptInformation = ({ paymentInfoModal, setPaymentInfoModal, customersList, user }) => {

    const [ReceiptInfoDetail, setReceiptInfoDetail] = useState([])

    const [customer, setCustomer] = useState(null)

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
                    {`${fDate(row?.credit?.date)}`}
                </Box>
            )
        },
        {
            name: 'Amount(₹)',
            cell: (row, index) => (
                <Box>
                    {`₹ ${row?.credit?.amount}`}
                </Box>
            )
        },
    ]

    const getReceiptInfo = async () => {

        const response = await axios.post('/api/customer/list/',
            {
                aggregate: true,
                query: "fetchSaleLedgerReceipts",
                startDate: startDate,
                endDate: endDate,
                name: `${customer}-${user?._id}`
            }

        )

        if (response?.data?.status) {
            setReceiptInfoDetail(response?.data?.data || [])
        }
    }

    return (
        <>
            <IconButton onClick={() => setPaymentInfoModal(false)} sx={{ position: 'absolute', top: 15, right: 10, cursor: 'pointer' }} >
                <CloseIcon />
            </IconButton>
            <Typography my={3} fontWeight="bold" textAlign="center">
                Receipt Information
            </Typography>
            {paymentInfoModal ? (
                <Filters
                    device="desktop"
                    isLedgerFilter={true}
                    nameTag="Account"
                    buttonTag="Collect"
                    name={customer}
                    setName={setCustomer}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    names={customersList.filter(name => !name.includes('Balance Account') && !name.includes('Loss Account'))}
                    applyFilter={getReceiptInfo}
                />
            ) : null}
            <br />
            {ReceiptInfoDetail.length > 0 ? (
                <DataTable
                    size="medium"
                    columns={Columns}
                    data={ReceiptInfoDetail || []}
                />
            ) : (
                <Box textAlign="center" >
                    No Records To Display
                </Box>
            )}
        </>
    )
}


export default ReceiptInformation