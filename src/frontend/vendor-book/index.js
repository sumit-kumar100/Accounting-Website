import AddIcon from '@mui/icons-material/Add'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import {
    Box,
    Button,
    Modal,
    TextField,
    Stack,
    Container,
    Typography,
    FormControl,
    OutlinedInput,
    InputAdornment
} from '@mui/material'

const DataTable = dynamic(() => import('../../components/datatable'), { ssr: true })

const Menu = dynamic(() => import('../../components/menu'), { ssr: true })

const Label = dynamic(() => import('../../components/label'), { ssr: true })

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 300,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 3
}

const Vendor = ({ users, createRecord, updateRecord, deleteRecord, user }) => {

    const [vendor, setVendor] = useState({ _id: null, name: '' })

    const [error, setError] = useState(false)

    const [userList, setUserList] = useState(users)

    const [pending, setPending] = useState(false)

    const [filterdUser, setFilteredUser] = useState(users)

    const [modal, setModal] = useState(false)

    const [search, setSearch] = useState('')

    const setUsers = (response) => {
        setModal(false)
        setPending(false)
        setVendor({ _id: null, name: '' })
        setUserList(response?.data?.data)
        setFilteredUser(response?.data?.data)
    }

    const searchCustomer = ({ target }) => {
        setSearch(target.value)
        if (target.value !== "") {
            setFilteredUser(userList.filter(user => user.name.toLowerCase().includes(target.value.toLowerCase())))
            return
        }
        setFilteredUser(userList)
    }


    const handleSubmit = async e => {
        e?.preventDefault()
        if (vendor.name.length) {
            setPending(true)
            const resp = await (!vendor._id ? createRecord({ ...vendor, name: `${vendor.name.replaceAll('-', " ").trim()}-${user?._id}` }) : updateRecord({ ...vendor, name: `${vendor.name.replaceAll('-', " ").trim()}-${user?._id}` }))
            if (resp) {
                setUsers(resp)
                return
            }
            setModal(false)
            setPending(false)
            setVendor({ _id: null, name: '' })
        }
        setError(true)
    }

    const activateUser = async row => {
        const resp = await updateRecord(row)
        setUsers(resp)
    }

    const columns = [
        {
            name: 'S.No.',
            center: true,
            width: "180px",
            cell: (row, index) => (
                <Box width="180px" textAlign="center">
                    {`${index + 1}`}
                </Box>
            )
        },
        {
            name: 'Full Name',
            center: true,
            width: "180px",
            cell: row => (
                <Box width="180px" textAlign="center">
                    {`${row?.name}`}
                </Box>
            )
        },
        {
            name: 'Status',
            center: true,
            width: "180px",
            cell: row => (
                <Box width="180px" textAlign="center">
                    <Label variant="ghost" color={(!row?.status && 'error') || 'success'}>
                        {row?.status ? "Active" : "Inactive"}
                    </Label>
                </Box>
            )
        },
        {
            name: "Edit",
            center: true,
            width: "180px",
            cell: row => (
                <Box width="180px" textAlign="center">
                    <Menu
                        onEdit={() => {
                            setVendor(row)
                            setModal(!modal)
                        }}
                        onDelete={async () => {
                            const resp = await deleteRecord(row?._id, `${row?.name}-${user?._id}`)
                            if (resp) {
                                setUsers(resp)
                                return
                            }
                            setModal(false)
                            setPending(false)
                            setVendor({ _id: null, name: '' })
                        }}
                        isActivateMenu={row.status ? false : true}
                        ActivateMenu={() => activateUser(row)}
                    />
                </Box>
            )
        }
    ]

    return (<>
        <Modal
            open={modal}
            onClose={() => setModal(!modal)}
        >
            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Box sx={style}>
                    <TextField
                        fullWidth
                        size='small'
                        placeholder='Full Name'
                        className='my-text-input'
                        name='name'
                        value={vendor.name}
                        error={error}
                        helperText={error ? "This field is required." : null}
                        onChange={e => {
                            setVendor({ ...vendor, [e.target.name]: e.target.value })
                            setError(false)
                        }}
                    />
                    <Button
                        fullWidth
                        sx={{ mt: 2 }}
                        type="submit"
                        variant="contained"
                        disabled={pending}
                    >
                        {pending ? "SAVING" : "SAVE"}
                    </Button>
                </Box>
            </form>
        </Modal>
        <Container>
            <Box sx={{ p: 0.5 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Button
                        disabled={new Date() > new Date(user?.active_package?.expires_on)}
                        variant="contained"
                        size="small"
                        onClick={() => setModal(!modal)}
                        startIcon={<AddIcon />}
                    >
                        {"New Vendor"}
                    </Button>
                    <FormControl sx={{ width: { xs: '150px', md: '200px' } }} variant="outlined">
                        <OutlinedInput
                            value={search}
                            size="small"
                            placeholder='Search'
                            className='my-search'
                            onChange={searchCustomer}
                            startAdornment={(
                                <InputAdornment position="start">
                                    <SearchRoundedIcon />
                                </InputAdornment>
                            )}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                                'aria-label': 'weight',
                            }}
                        />
                    </FormControl>
                </Stack>
                {filterdUser?.length ? (
                    <DataTable
                        columns={columns}
                        data={filterdUser}
                    />) : (
                    <Typography fontWeight="400" fontSize={16} textAlign="center" mt={3} mb={1}>
                        No Records To Display
                    </Typography>
                )}

            </Box>
        </Container>
    </>)
}

export default Vendor

