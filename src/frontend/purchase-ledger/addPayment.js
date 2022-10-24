import Autocomplete from '@mui/material/Autocomplete'
import axios from 'axios'
import HighLight from 'react-highlighter'
import EditIcon from '@mui/icons-material/Edit'
import dynamic from 'next/dynamic'
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation'
import { useRef, useState, Fragment, useEffect } from 'react'
import { FormControl, Button, Typography, InputAdornment, TextField, Select, MenuItem } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { toast } from "react-toastify"

const MenuPopover = dynamic(() => import('../../components/menuPopover'), { ssr: true })

const Payment = ({ names, applyFilter, setVendor, row, search, vendor, user }) => {

    const anchorRef = useRef(null)

    const [open, setOpen] = useState(false)

    const [pending, setPending] = useState(false)

    const [payment, setPayment] = useState({
        date: new Date(),
        vendor: null,
        mode: "",
        amount: 0
    })

    const handleSubmit = async e => {
        e?.preventDefault()
        setPending(true)
        const params = row ? (
            payment.amount > 0 ? {
                query: {
                    'debit._id': row?._id
                },
                update: {
                    'debit.$.date': payment.date,
                    'debit.$.amount': payment.amount,
                    'debit.$.mode': payment.mode
                }
            } : {
                query: {
                    'debit._id': row?._id
                },
                update: {
                    $pull: {
                        debit: {
                            "_id": row?._id
                        }
                    }
                }
            }
        ) : {
            query: {
                name: `${payment.vendor}-${user?._id}`
            },
            update: {
                $push: {
                    debit: {
                        date: payment.date,
                        amount: payment.amount,
                        mode: payment.mode
                    }
                }
            }
        }
        const response = await axios.put('/api/vendor/', { updateName: false, conditions: params })
        if (response?.data?.status) {
            setVendor(payment.vendor)
            setPending(false)
            setOpen(false)
            !row ? await applyFilter({ vendor: payment.vendor }) : applyFilter()
            setPayment({ date: new Date(), vendor: null, mode: "", amount: 0 })
            toast.success(`Payment ${row ? "Updated" : "Done"} Successfully`)
        }
    }

    useEffect(() => {
        if (row) {
            setPayment({ ...payment, date: row?.date, vendor: vendor, mode: row?.mode, amount: row?.amount })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [row])


    return (
        <Fragment>
            {!row ? (
                <Button ref={anchorRef} onClick={() => setOpen(true)} variant="contained" color="secondary" size="small">
                    Add Payment
                </Button>
            ) : (
                <span
                    ref={anchorRef}
                    onClick={() => setOpen(true)}
                    style={{
                        color: '#2065D1',
                        cursor: 'pointer'
                    }}>
                    <HighLight search={search}>
                        {`₹ ${parseInt(row?.amount)} `}<EditIcon sx={{ fontSize: 12, marginBottom: -0.1 }} />
                    </HighLight>

                </span>
            )}

            <MenuPopover
                open={open}
                onClose={() => setOpen(false)}
                anchorEl={anchorRef.current}
                sx={{
                    mt: 1.5,
                    ml: row ? { xs: 2, md: -8 } : 2,
                    width: 250,
                    p: { xs: 3, md: 4 },
                    '& .MuiMenuItem-root': { px: 2, typography: 'body2', borderRadius: 0.75 },
                }}>
                <form onSubmit={handleSubmit}>
                    <Typography fontSize="14px" fontWeight="600" marginBottom={1}>
                        Date
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDatePicker
                            inputFormat="dd/MM/yyyy"
                            value={payment.date}
                            disableFuture={true}
                            closeOnSelect
                            onChange={date => setPayment({ ...payment, date: date })}
                            showDaysOutsideCurrentMonth={false}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <InsertInvitationIcon fontSize='small' />
                                    </InputAdornment>
                                )
                            }}
                            renderInput={params => (
                                <TextField
                                    sx={{ marginBottom: 2 }}
                                    className='my-date-picker'
                                    required
                                    size='small'
                                    {...params}
                                />
                            )}
                        />
                    </LocalizationProvider>

                    {!row ? (<>
                        <Typography fontSize="14px" fontWeight="600" marginBottom={1}>
                            Vendor
                        </Typography>

                        <Autocomplete
                            value={payment.vendor}
                            onChange={(e, name) => setPayment({ ...payment, vendor: name })}
                            options={names}
                            renderInput={(params) => (
                                <TextField
                                    fullWidth
                                    sx={{ marginBottom: 2 }}
                                    required
                                    type="text"
                                    name="vendor"
                                    className='my-text-input'
                                    placeholder="To"
                                    size="small"
                                    {...params}
                                />
                            )}
                        />
                    </>) : null}


                    <Typography fontSize="14px" fontWeight="600" marginBottom={1}>
                        Mode
                    </Typography>

                    <FormControl fullWidth>
                        <Select
                            className='my-text-input'
                            size="small"
                            name="mode"
                            placeholder='Mode'
                            required
                            sx={{ marginBottom: 2 }}
                            value={payment.mode}
                            onChange={e => setPayment({ ...payment, mode: e.target.value })}
                        >
                            <MenuItem value={'CASH'}>Cash</MenuItem>
                            <MenuItem value={'BANK'}>Bank</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography fontSize="14px" fontWeight="600" marginBottom={1}>
                        Amount
                    </Typography>

                    <FormControl variant="outlined">
                        <TextField
                            value={payment.amount}
                            required
                            size="small"
                            placeholder='Charges'
                            sx={{ marginBottom: 3 }}
                            type='number'
                            className='my-text-input'
                            InputProps={{ inputProps: !row ? { min: 1 } : {} }}
                            onChange={e => setPayment({ ...payment, amount: e.target.value })}
                        />
                    </FormControl>

                    <Button
                        disabled={new Date() > new Date(user?.active_package?.expires_on) || pending}
                        type="submit"
                        variant="contained"
                        sx={{ width: '100%' }}
                        size="small"
                    >
                        {!row ? "Continue to Pay" : "Update"}
                    </Button>
                </form>

            </MenuPopover>
        </Fragment>
    )
}

export default Payment