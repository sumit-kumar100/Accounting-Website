import HighLight from 'react-highlighter'
import EditIcon from '@mui/icons-material/Edit';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation'
import dynamic from 'next/dynamic';
import { useRef, useState, Fragment, useEffect } from 'react'
import { FormControl, Button, Typography, InputAdornment, TextField, Select, MenuItem } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

const MenuPopover = dynamic(() => import('../../components/menuPopover'), { ssr: true })

const Card = ({ row, handleCashSubmit, debit, search, user }) => {

    const anchorRef = useRef(null)

    const [open, setOpen] = useState(false)

    const [data, setData] = useState({
        date: new Date(),
        information: "",
        mode: "",
        amount: 0
    })

    const handleSubmit = async e => {
        e?.preventDefault()
        const response = await handleCashSubmit(data, row)
        if (response?.data?.status) {
            setOpen(false)
            setData({ date: new Date(), information: "", mode: "", amount: 0 })
        }
    }

    useEffect(() => {
        if (row) {
            setData({ ...data, ...row })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [row])


    return (
        <Fragment>
            {!row ? (
                <Button ref={anchorRef} onClick={() => setOpen(true)} color="primary" size="small">
                    {debit ? "+ Cash Receipt" : "+ Cash Paid"}
                </Button>
            ) : (
                <span
                    ref={anchorRef}
                    onClick={() => setOpen(true)}
                    style={{
                        color: '#2065D1',
                        cursor: 'pointer',
                        marginLeft: 20
                    }}>
                    <HighLight search={search}>
                        {`₹ ${row?.amount}`} <EditIcon sx={{ fontSize: 12, marginBottom: -0.1 }} />
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
                            value={new Date(data.date)}
                            disableFuture={true}
                            closeOnSelect
                            onChange={date => setData({ ...data, date: date })}
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

                    <Typography fontSize="14px" fontWeight="600" marginBottom={1}>
                        Information
                    </Typography>

                    <FormControl variant="outlined">
                        <TextField
                            value={data.information}
                            required
                            size="small"
                            placeholder='describe'
                            sx={{ marginBottom: 3 }}
                            className='my-text-input'
                            onChange={e => setData({ ...data, information: e.target.value })}
                        />
                    </FormControl>

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
                            value={data.mode}
                            onChange={e => setData({ ...data, mode: e.target.value })}
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
                            value={data.amount}
                            required
                            size="small"
                            placeholder='Charges'
                            sx={{ marginBottom: 3 }}
                            type='number'
                            className='my-text-input'
                            InputProps={{ inputProps: !row ? { min: 1 } : {} }}
                            onChange={e => setData({ ...data, amount: e.target.value })}
                        />
                    </FormControl>

                    <Button
                        disabled={new Date() > new Date(user?.active_package?.expires_on)}
                        type="submit"
                        variant="contained"
                        sx={{ width: '100%' }}
                        size="small"
                    >
                        {!row ? "Submit" : "Update"}
                    </Button>
                </form>
            </MenuPopover>
        </Fragment>
    )
}


export default Card