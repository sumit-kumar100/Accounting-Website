import HighLight from 'react-highlighter'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { fDate, formatDate2 } from '../../utils/formatTime'
import { deleteAlert } from '../../components/alert'

const Filters = dynamic(() => import('./filters'), { ssr: true })

const DataTable = dynamic(() => import('../../components/datatable'), { ssr: true })

const Menu = dynamic(() => import('../../components/menu'), { ssr: true })

const ViewEntry = ({ state, setEdit, deleteRecord, dispatch, getData, date, setDate, actions }) => {

    const [search, setSearch] = useState("")

    const handleEdit = row => {
        setEdit(row)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const handleDelete = async row => {
        const confirm = await deleteAlert()
        if (confirm) {
            await deleteRecord(row._id, date)
            dispatch(actions.updateMessage("Entry Deleted Successfully"))
        }
        return
    }

    const columns = [
        {
            name: 'Date',
            cell: row => (
                <Box width="120px">
                    <HighLight search={search}>
                        {`${fDate(row.created_at)}`}
                    </HighLight>
                </Box>
            )
        },
        {
            name: 'Details',
            cell: row => (
                <Box width="280px">
                    <Box my={1}>
                        <HighLight search={search}>
                            {`${row.quantity} ${row.details} ${row.vendor.split('-')[0]} ${"x"} ${row.price} ${row.mode === 'CASH' ? '(cash)' : row.mode === 'BANK' ? '(bank)' : ''}`}
                        </HighLight>
                    </Box>
                    {row?.sales?.map((item, index) => (
                        <Box key={index} marginLeft={fDate(row.created_at) !== fDate(item.created_at) ? 0 : 5}>
                            <Box my={0.5}>
                                {fDate(row.created_at) !== fDate(item.created_at) ? (
                                    <span style={{ paddingRight: 20 }}>
                                        {`(${formatDate2(item.created_at)})*`}
                                    </span>
                                ) : null}
                                <HighLight search={search}>
                                    {`${item.quantity} ${item.details} ${item.customer.split('-')[0]} ${"x"} ${item.price} ${item.mode === 'CASH' ? '(cash)' : item.mode === 'BANK' ? '(bank)' : ''}`}
                                </HighLight>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )
        },
        {
            name: 'Purchases(₹)',
            cell: row => (
                <Box width="100px">
                    <Box my={1}>
                        <HighLight search={search}>
                            {`₹ ${row.total}`}
                        </HighLight>
                    </Box>
                    <Box marginLeft={5}>
                        {row?.sales?.map((item, index) => (
                            <Box my={0.5} key={index}>
                                <span style={{ visibility: 'hidden' }}>{"null"}</span>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )
        },
        {
            name: 'Sales(₹)',
            cell: row => (
                <Box width="100px">
                    <Box my={1}>
                        <span style={{ visibility: 'hidden' }}>{"null"}</span>
                    </Box>
                    <Box>
                        {row?.sales?.map((item, index) => (
                            <Box my={0.5} key={index}>
                                <HighLight search={search}>
                                    {`₹ ${item.total}`}
                                </HighLight>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )
        },
        {
            name: 'Profit(₹)',
            cell: row => (
                <Box widht="100px">
                    <HighLight search={search}>
                        {`₹ ${(row?.sales?.reduce((total, item) => !item.customer.includes('Loss Account') ? total + item.total : total + 0, 0)) - (row?.total)}`}
                    </HighLight>
                </Box>
            )

        },
        {
            name: "Edit",
            center: true,
            cell: row => (
                <Menu
                    onEdit={() => handleEdit(row)}
                    onDelete={() => handleDelete(row)}
                />
            )
        }
    ]

    return (
        <Box>
            <Typography fontWeight="400" fontSize={{ xs: 16, md: 21 }} textAlign="center" my={2}>
                {`Entries for, ${fDate(state?.entryData[0]?.created_at || new Date())}`}
            </Typography>

            <Filters
                getData={getData}
                search={search}
                setSearch={setSearch}
                date={date}
                setDate={setDate}
            />
            {state?.entryData?.length ? (
                <DataTable
                    columns={columns}
                    data={state?.entryData}
                />
            ) : (
                <Typography fontWeight="400" fontSize={16} textAlign="center" mt={3} mb={1}>
                    No Records To Display
                </Typography>
            )}

        </Box>
    )
}

export default ViewEntry