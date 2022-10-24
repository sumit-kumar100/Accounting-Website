import CloseIcon from '@mui/icons-material/Close'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Box, Modal, Typography, FormControl, OutlinedInput, InputAdornment, Button, IconButton } from '@mui/material'

const ReceiptInformation = dynamic(() => import('./receiveInfo'), { ssr: true })

const Receipt = dynamic(() => import('./receivePayment'), { ssr: true })

const DebitTable = dynamic(() => import('./debitTable'), { ssr: true })

const CreditTable = dynamic(() => import('./creditTable'), { ssr: true })

const Account = dynamic(() => import('./balance_loss_table'), { ssr: true })

const Filters = dynamic(() => import('../../components/filters'), { ssr: true })

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    border: 'none',
    borderRadius: 7.5,
    outline: 'none',
    width: '70%',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 50
}

const ViewSaleLedger = ({ state, getData, dispatch, actions, user }) => {

    const customersList = state?.customers?.map(user => user.name)

    const [customer, setCustomer] = useState(null)

    const [startDate, setStartDate] = useState(new Date())

    const [endDate, setEndDate] = useState(new Date())

    const [paymentInfoModal, setPaymentInfoModal] = useState(false)

    const [modal, setModal] = useState(false)

    const [show, setShow] = useState(false)

    const [search, setSearch] = useState("")

    const [receivableAmount, setReceivableAmount] = useState(false)

    const applyFilter = async (options) => {
        await getData(
            {
                aggregate: true,
                startDate: startDate,
                endDate: endDate,
                name: options ? `${options.customer}-${user?._id}` : `${customer}-${user?._id}`
            }
        )
        setShow(true)
        setModal(false)
    }

    const calculateReceivableAmt = async () => {
        if (receivableAmount) return
        if (receivableAmount === 0) return
        const params1 = {
            aggregate: true,
            conditions: [
                { $match: { name: `${customer}-${user?._id}` } },
                {
                    $project: {
                        'name': 1,
                        'debit': 1,
                        'totalCredit': {
                            $sum: '$credit.amount'
                        }
                    }
                }
            ]
        }
        const params2 = {
            aggregate: true,
            conditions: [
                { $unwind: "$sales" },
                { $match: { 'sales.customer': `${customer}-${user?._id}`, 'sales.mode': 'CREDIT' } },
                { $replaceRoot: { newRoot: "$sales" } },
                { $group: { _id: null, totalDebit: { $sum: '$total' }, totalCharges: { $sum: '$charges' } } }
            ]
        }
        const [res1, res2] = await axios.all([
            axios.post('/api/customer/list/', params1),
            axios.post('/api/entry/list/', params2)
        ])
        try {
            setReceivableAmount((res2.data.data[0].totalCharges + res2.data.data[0].totalDebit + res1.data.data[0].debit) - (res1.data.data[0].totalCredit))
        } catch (e) {
            setReceivableAmount(0)
        }
    }

    useEffect(() => {
        setReceivableAmount(false)
        if (customer === null) {
            show ? setShow(false) : null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer, state?.saleLedgerData, state?.customerLedgerData])

    return (<>
        <Box display="flex" justifyContent="space-between" alignItems="end" marginBottom={3}>
            <FormControl variant="outlined" sx={{ width: { xs: '160px', md: '200px' } }}>
                <OutlinedInput
                    value={search}
                    size="small"
                    placeholder='Search Text'
                    className='my-search'
                    onChange={e => setSearch(e.target.value)}
                    startAdornment={(
                        <InputAdornment position="start">
                            <SearchRoundedIcon sx={{ fontSize: 20 }} />
                        </InputAdornment>
                    )}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                        'aria-label': 'weight',
                    }}
                />
            </FormControl>
            {!modal ? (
                <Box display={{ xs: 'none', md: 'block' }}>
                    <Filters
                        device="desktop"
                        isLedgerFilter={true}
                        nameTag="Accounts"
                        name={customer}
                        setName={setCustomer}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        names={customersList}
                        applyFilter={applyFilter}
                    />
                </Box>
            ) : null}
            <Button
                variant="outlined"
                size="small"
                onClick={() => setModal(true)}
                display="none"
                sx={{
                    display: {
                        xs: 'block',
                        md: 'none'
                    }
                }}>
                Filters
            </Button>
        </Box>
        <Box display="flex" justifyContent="space-between">
            <Button onClick={() => setPaymentInfoModal(true)} variant="contained" color="error" size="small">
                Get Receipt Info
            </Button>
            <Receipt
                names={customersList}
                applyFilter={applyFilter}
                setCustomer={setCustomer}
                row={null}
                user={user}
            />
        </Box>
        {show ? (<>
            {state?.customerLedgerData?.type === 'ACCOUNT' ? (
                <Box display="flex" justifyContent="space-between">
                    <Typography mx={2} my={1.5} fontWeight="600">
                        Dr.
                    </Typography>
                    <Typography mx={2} my={1.5} fontWeight="600">
                        Cr.
                    </Typography>
                </Box>
            ) : null}
            <Box display="flex" sx={{ overflowX: 'auto' }}>
                {state?.customerLedgerData?.type === 'ACCOUNT' ? (
                    <>
                        <DebitTable
                            search={search}
                            openingBalance={state.customerLedgerData.debit || 0}
                            debits={state?.saleLedgerData || []}
                            state={state}
                            startDate={startDate}
                            endDate={endDate}
                            dispatch={dispatch}
                            actions={actions}
                        />
                        <CreditTable
                            credits={state?.customerLedgerData?.credit || []}
                            customersList={customersList}
                            applyFilter={applyFilter}
                            search={search}
                            customer={customer}
                            setCustomer={setCustomer}
                        />
                    </>
                ) : (
                    <Account
                        search={search}
                        debits={state?.saleLedgerData || []}
                    />
                )}
            </Box>
        </>) : (
            <Typography fontWeight="400" fontSize={16} textAlign="center" mt={3} mb={1}>
                No Records To Display
            </Typography>
        )}
        <Button
            disabled={!customer || customer === 'Balance Account' || customer === 'Losses Account' ? true : false}
            onClick={calculateReceivableAmt}
            color='secondary'
            sx={{
                position: 'fixed',
                right: 5,
                bottom: 5
            }}>
            {receivableAmount ? `Total Receivable Amount : ₹ ${receivableAmount}` : receivableAmount === 0 ? `Total Receivable Amount : ₹ 0` : `Calculate Receivable(₹) Till Now`}
        </Button>
        <Modal open={modal} onClose={() => setModal(false)}>
            <Box style={style}>
                <IconButton onClick={() => setModal(false)} sx={{ position: 'absolute', top: 5, right: 10, cursor: 'pointer' }} >
                    <CloseIcon />
                </IconButton>
                <Typography my={2} fontWeight="bold" textAlign="center">
                    Select
                </Typography>
                {modal ? (
                    <Filters
                        device="mobile"
                        isLedgerFilter={true}
                        nameTag="Accounts"
                        name={customer}
                        setName={setCustomer}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        names={customersList}
                        applyFilter={applyFilter}
                    />
                ) : null}
            </Box>
        </Modal>
        <Modal open={paymentInfoModal} onClose={() => setPaymentInfoModal(false)}>
            <Box style={{ ...style, width: '90%', overflow: 'auto', height: '80%' }}>
                <ReceiptInformation
                    paymentInfoModal={paymentInfoModal}
                    setPaymentInfoModal={setPaymentInfoModal}
                    customersList={customersList}
                    user={user}
                />
            </Box>
        </Modal>
    </>)
}

export default ViewSaleLedger