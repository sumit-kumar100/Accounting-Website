import HighLight from 'react-highlighter'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { fDate } from '../../utils/formatTime'
import { Box } from '@mui/material'

const Charges = dynamic(() => import('../../components/charges'), { ssr: true })

const handleCharges = async (charges, row, vendor, startDate, endDate, getData, user) => {

    const response = await axios.patch('/api/entry/', {
        purchases: true,
        ids: row.map(data => data._id),
        charges: charges
    })

    if (response?.data?.status) {
        await getData({
            aggregate: true,
            query: "fetchPurchase",
            startDate: startDate,
            endDate: endDate,
            name: vendor ? `${vendor}-${user?._id}` : null
        })
    }
    return true
}

const Columns = (search, vendor, startDate, endDate, getData, user) => (
    [
        {
            name: 'Date',
            cell: row => (
                <Box width='120px'>
                    <HighLight search={search}>
                        {`${fDate(row?._id)}`}
                    </HighLight>
                </Box>
            )
        },
        {
            name: 'Details',
            cell: row => (
                row?.names?.map((item, i) => (
                    <Box key={i} my={2} width='260px'>
                        <Box>
                            <HighLight search={search}>
                                {`from ${item?._id?.name.split('-')[0]}`}
                            </HighLight>
                        </Box>
                        <Box marginLeft={5}>
                            {item?.data?.map((purchase, index) => (
                                <Box my={0.2} key={index}>
                                    <HighLight search={search}>
                                        {`${purchase.quantity} ${purchase.details}  ${"x"} ${purchase.price}`}
                                    </HighLight>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ))
            )
        },
        {
            name: 'Amount(₹)',
            cell: row => (
                row?.names?.map((item, i) => (
                    <Box key={i} my={2} width='120px'>
                        <Box>
                            <span style={{ visibility: 'hidden' }}>{"null"}</span>
                        </Box>
                        <Box>
                            {item?.data?.map((purchase, index) => (
                                <Box my={0.2} key={index}>
                                    <HighLight search={search}>
                                        {`₹ ${purchase.total}`}
                                    </HighLight>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ))
            )
        },
        {
            name: 'Charges(₹)',
            cell: row => (
                row?.names?.map((item, i) => {
                    return (
                        <Box key={i} my={2} width='120px'>
                            <Box>
                                <span style={{ visibility: 'hidden' }}>{"null"}</span>
                            </Box>
                            <Box>
                                {item?.data?.map((purchase, index) => (
                                    <Box my={0.2} key={index}>
                                        {(item?.data?.length - 1) === index ? (
                                            <Charges
                                                search={search}
                                                additionalCost={`${item?.data?.reduce((prev, curr) => prev + curr.charges, 0)}`}
                                                handleCharges={charges => handleCharges(charges, item?.data, vendor, startDate, endDate, getData, user)}
                                            />
                                        ) : (<span style={{ visibility: 'hidden' }}>{"null"}</span>)}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )
                })
            )
        },
        {
            name: 'Total(₹)',
            cell: row => (
                row?.names?.map((item, i) => (
                    <Box key={i} my={2} width='120px'>
                        <Box>
                            <span style={{ visibility: 'hidden' }}>{"null"}</span>
                        </Box>
                        <Box>
                            {item?.data?.map((purchase, index) => (
                                <Box my={0.2} key={index}>
                                    <HighLight search={search}>
                                        {(item?.data?.length - 1) === index ? (
                                            `₹ ${item?.data?.reduce((prev, curr) => prev + curr.charges + curr.total, 0).toFixed(0)}`
                                        ) : (<span style={{ visibility: 'hidden' }}>{"null"}</span>)}
                                    </HighLight>
                                </Box>
                            ))}
                        </Box>
                    </Box >
                ))
            )
        }
    ]
)

export default Columns