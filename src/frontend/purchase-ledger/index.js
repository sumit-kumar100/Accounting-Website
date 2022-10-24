import CloseIcon from '@mui/icons-material/Close'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Box, Modal, Typography, FormControl, OutlinedInput, InputAdornment, Button, IconButton } from '@mui/material'

const PaymentInformation = dynamic(() => import('./paymentInfo'), { ssr: true })

const Payment = dynamic(() => import('./addPayment'), { ssr: true })

const CreditTable = dynamic(() => import('./creditTable'), { ssr: true })

const DebitTable = dynamic(() => import('./debitTable'), { ssr: true })

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

const ViewPurchaseLedger = ({ state, getData, dispatch, actions, user }) => {

    const vendorsList = state?.vendors?.map(user => user.name)

    const [vendor, setVendor] = useState(null)

    const [startDate, setStartDate] = useState(new Date())

    const [endDate, setEndDate] = useState(new Date())

    const [paymentInfoModal, setPaymentInfoModal] = useState(false)

    const [modal, setModal] = useState(false)

    const [show, setShow] = useState(false)

    const [search, setSearch] = useState("")

    const [payableAmount, setPayableAmount] = useState(false)

    const applyFilter = async (options) => {
        await getData(
            {
                aggregate: true,
                startDate: startDate,
                endDate: endDate,
                name: options ? `${options?.vendor}-${user?._id}` : `${vendor}-${user?._id}`
            }
        )
        setShow(true)
        setModal(false)
    }

    const calculatePayableAmt = async () => {
        if (payableAmount) return
        if (payableAmount === 0) return
        const params1 = {
            aggregate: true,
            conditions: [
                { $match: { name: `${vendor}-${user?._id}` } },
                {
                    $project: {
                        'name': 1,
                        'credit': 1,
                        'totalDebit': {
                            $sum: '$debit.amount'
                        }
                    }
                }
            ]
        }
        const params2 = {
            aggregate: true,
            conditions: [
                { $match: { vendor: `${vendor}-${user?._id}`, 'mode': 'CREDIT' } },
                { $group: { _id: null, totalCredit: { $sum: '$total' }, totalCharges: { $sum: '$charges' } } }
            ]
        }

        const [res1, res2] = await axios.all([
            axios.post('/api/vendor/list/', params1),
            axios.post('/api/entry/list/', params2)
        ])


        try {
            setPayableAmount((res2.data.data[0].totalCharges + res2.data.data[0].totalCredit + res1.data.data[0].credit) - (res1.data.data[0].totalDebit))
        } catch (e) {
            setPayableAmount(0)
        }
    }

    useEffect(() => {
        setPayableAmount(false)
        if (vendor === null) {
            show ? setShow(false) : null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vendor, state?.purchaseLedgerData, state?.vendorLedgerData])

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
                        name={vendor}
                        setName={setVendor}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        names={vendorsList}
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
            <Payment
                names={vendorsList}
                applyFilter={applyFilter}
                setVendor={setVendor}
                row={null}
                user={user}
            />
            <Button onClick={() => setPaymentInfoModal(true)} variant="contained" color="error" size="small">
                Get Payment Info
            </Button>
        </Box>
        {show ? (<>
            <Box display="flex" justifyContent="space-between">
                <Typography mx={2} my={1.5} fontWeight="600">
                    Dr.
                </Typography>
                <Typography mx={2} my={1.5} fontWeight="600">
                    Cr.
                </Typography>
            </Box>
            <Box display="flex" sx={{ overflowX: 'auto' }}>
                <DebitTable
                    debits={state?.vendorLedgerData?.debit || []}
                    vendorsList={vendorsList}
                    applyFilter={applyFilter}
                    search={search}
                    vendor={vendor}
                    setVendor={setVendor}
                />
                <CreditTable
                    search={search}
                    openingBalance={state?.vendorLedgerData?.credit || 0}
                    credits={state?.purchaseLedgerData ? state.purchaseLedgerData : []}
                    state={state}
                    startDate={startDate}
                    endDate={endDate}
                    dispatch={dispatch}
                    actions={actions}
                />
            </Box>
        </>) : (
            <Typography fontWeight="400" fontSize={16} textAlign="center" mt={3} mb={1}>
                No Records To Display
            </Typography>
        )}
        <Button
            disabled={!vendor ? true : false}
            onClick={calculatePayableAmt}
            color="secondary"
            sx={{
                position: 'fixed',
                right: 5,
                bottom: 5
            }}>
            {payableAmount ? `Total Payable Amount : ₹ ${payableAmount}` : payableAmount === 0 ? `Total Payable Amount : ₹ 0` : `Calculate Payable(₹) Till Now`}
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
                        name={vendor}
                        setName={setVendor}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        names={vendorsList}
                        applyFilter={applyFilter}
                    />
                ) : null}
            </Box>
        </Modal>
        <Modal open={paymentInfoModal} onClose={() => setPaymentInfoModal(false)}>
            <Box style={{ ...style, width: '90%', overflow: 'auto', height: '80%' }}>
                <PaymentInformation
                    paymentInfoModal={paymentInfoModal}
                    setPaymentInfoModal={setPaymentInfoModal}
                    vendorsList={vendorsList}
                    user={user}
                />
            </Box>
        </Modal>
    </>)
}

export default ViewPurchaseLedger