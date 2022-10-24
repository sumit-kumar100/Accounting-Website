import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import CloseIcon from '@mui/icons-material/Close'
import Columns from './columns'
import dynamic from 'next/dynamic'
import {
    Box,
    InputAdornment,
    FormControl,
    OutlinedInput,
    Typography,
    Button,
    Modal
} from '@mui/material'
import { formatDate, formatDate2 } from '../../utils/formatTime'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fDate } from '../../utils/formatTime'

const Filters = dynamic(() => import('../../components/filters'), { ssr: true })

const DataTable = dynamic(() => import('../../components/datatable'), { ssr: true })

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

const ViewPurchases = ({ state, getData }) => {

    const vendorsList = state?.vendors?.map(user => user.name)

    const { user } = useSelector(state => state.user)

    const [vendor, setVendor] = useState(null)

    const [startDate, setStartDate] = useState(new Date())

    const [endDate, setEndDate] = useState(new Date())

    const [search, setSearch] = useState("")

    const [modal, setModal] = useState(false)

    const [amount, setAmount] = useState(0)

    const applyFilter = async () => {
        await getData(
            {
                aggregate: true,
                query: "fetchPurchase",
                startDate: startDate,
                endDate: endDate,
                name: vendor ? `${vendor}-${user?._id}` : null
            }
        )
        setModal(false)
    }

    useEffect(() => {
        const getPurchases = Math.ceil(state?.purchaseData?.reduce((prev, curr) => (
            prev + curr?.names?.reduce((sum, row) => (
                sum + row?.data?.reduce((total, item) => (
                    total += item.total + item.charges
                ), 0)
            ), 0)
        ), 0))
        setAmount(getPurchases)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state?.purchaseData])


    return (
        <Box>
            <Modal open={modal} onClose={() => setModal(false)}>
                <Box style={style}>
                    <span onClick={() => setModal(false)}>
                        <CloseIcon sx={{ position: 'absolute', top: 15, right: 15, cursor: 'pointer' }} />
                    </span>
                    <span>
                        <Typography my={2} fontWeight="bold" textAlign="center">
                            Select
                        </Typography>
                    </span>
                    {modal ? (
                        <Filters
                            device="mobile"
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

            <Typography fontWeight="400" fontSize={{ xs: 16, md: 19 }} textAlign="center" my={3}>
                {formatDate(startDate) === formatDate(endDate) ? (
                    `Purchases for , ${fDate(state?.purchaseData[0]?.created_at || new Date())}`
                ) : (
                    `(${formatDate2(startDate)}) to (${formatDate2(endDate)})`
                )}
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="end" marginBottom={3}>
                <Box>
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
                </Box>
                <Box display={{ xs: 'none', md: 'block' }}>
                    {!modal ? (
                        <Filters
                            device="desktop"
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
                <Box display={{ xs: 'block', md: 'none' }}>
                    <Button variant="outlined" size="small" onClick={() => setModal(true)}>Filters</Button>
                </Box>
            </Box>
            {state?.purchaseData?.length ? (
                <DataTable
                    columns={Columns(search, vendor, startDate, endDate, getData, user)}
                    data={state?.purchaseData}
                />
            ) : (
                <Typography fontWeight="400" fontSize={16} textAlign="center" mt={3} mb={1}>
                    No Records To Display
                </Typography>
            )}

            <Box
                position="fixed"
                bottom={15}
                right={15}
                sx={{
                    background: '#0ea200',
                    color: '#ffffff',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    zIndex: 999
                }}
            >
                {`Total Purchases : ₹ ${amount || 0}`}
            </Box>
        </Box >
    )
}

export default ViewPurchases