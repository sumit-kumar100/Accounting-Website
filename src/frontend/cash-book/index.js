import CloseIcon from '@mui/icons-material/Close'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { handleDebitCash, handleCreditCash } from './crud'
import { Box, Typography, Button, FormControl, OutlinedInput, InputAdornment, Modal, IconButton } from '@mui/material'

const Card = dynamic(() => import('./card'), { ssr: true })

const Filters = dynamic(() => import('../../components/filters'), { ssr: true })

const DebitTable = dynamic(() => import('./debitTable'), { ssr: true })

const CreditTable = dynamic(() => import('./creditTable'), { ssr: true })

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


const ViewCash = ({ state, getData, dispatch, user }) => {

    const [search, setSearch] = useState("")

    const [startDate, setStartDate] = useState(new Date())

    const [endDate, setEndDate] = useState(new Date())

    const [modal, setModal] = useState(false)

    const applyFilter = async () => {
        getData(
            {
                aggregate: true,
                startDate: startDate,
                endDate: endDate,
                fetchUserCashOnly: false
            }
        )
        setModal(false)
    }

    return (
        <>
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
                            isCashFilter={true}
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
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
            <Box display={{ xs: 'block', md: 'none' }} marginY={2}>
                <Box display="flex" alignItems="center">
                    <Box height={10} width={10} backgroundColor="red" borderRadius={50} />
                    <Box fontSize={12} marginLeft={1}>Cash Sales & Purchases</Box>
                </Box>
                <Box display="flex" alignItems="center">
                    <Box height={10} width={10} backgroundColor="#2065D1" borderRadius={50} />
                    <Box fontSize={12} marginLeft={1}>Other Receipt & Paid</Box>
                </Box>
                <Box display="flex" alignItems="center">
                    <Box height={10} width={10} backgroundColor="green" borderRadius={50} />
                    <Box fontSize={12} marginLeft={1}>Cash Receipt & Paid</Box>
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
                <Card
                    search={search}
                    handleCashSubmit={(data, row) => handleDebitCash(data, row, startDate, endDate)}
                    row={null}
                    debit={true}
                    user={user}
                />
                <Box display="flex" gap={5}>
                    <Box sx={{
                        background: '#fdf6f6',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        display: { xs: 'none', md: 'block' }
                    }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box height={10} width={10} backgroundColor="red" borderRadius={50} />
                            <Box fontSize={12} marginLeft={1}>Cash Sales & Purchases</Box>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box height={10} width={10} backgroundColor="#2065D1" borderRadius={50} />
                            <Box fontSize={12} marginLeft={1}>Other Receipt & Paid</Box>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box height={10} width={10} backgroundColor="green" borderRadius={50} />
                            <Box fontSize={12} marginLeft={1}>Cash Receipt & Paid</Box>
                        </Box>
                    </Box>
                    <Card
                        search={search}
                        handleCashSubmit={(data, row) => handleCreditCash(data, row, startDate, endDate)}
                        row={null}
                        user={user}
                        credit={true}
                    />
                </Box>
            </Box>
            <Box display="flex" sx={{ overflowX: 'auto', marginTop: 2 }}>
                <DebitTable
                    state={state}
                    search={search}
                    startDate={startDate}
                    endDate={endDate}
                    dispatch={dispatch}
                />
                <CreditTable
                    state={state}
                    search={search}
                    startDate={startDate}
                    endDate={endDate}
                    dispatch={dispatch}
                />
            </Box>
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
                            isCashFilter={true}
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                            applyFilter={applyFilter}
                        />
                    ) : null}
                </Box>
            </Modal>
        </>
    )
}


export default ViewCash