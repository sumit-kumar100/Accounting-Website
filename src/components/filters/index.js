import Autocomplete from '@mui/material/Autocomplete'
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation'
import { useState } from 'react'
import { TextField, Box, Typography, InputAdornment, Button } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'


const Filters = ({ device, isLedgerFilter, isCashFilter, nameTag, buttonTag, names, name, setName, startDate, setStartDate, endDate, setEndDate, applyFilter }) => {

    const [pending, setPending] = useState(false)
    
    const handleSubmit = async e => {
        setPending(true)
        e?.preventDefault()
        await applyFilter()
        setPending(false)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={{ xs: 1, md: 2 }}>
                {!isCashFilter ? (
                    <Box>
                        <Typography
                            textAlign={{ xs: "left", md: "center" }}
                            marginBottom={device === 'mobile' ? "5px" : "0px"}
                            fontSize="14px"
                            fontWeight="600"
                        >
                            {nameTag}
                        </Typography>
                        <Autocomplete
                            value={name}
                            onChange={(e, name) => setName(name ? name : null)}
                            options={names}
                            renderInput={(params) => (
                                <TextField
                                    fullWidth
                                    type="text"
                                    required={isLedgerFilter ? true : false}
                                    sx={{ width: device === 'mobile' ? "100%" : '150px' }}
                                    className='my-text-input'
                                    placeholder='search'
                                    size="small"
                                    {...params}
                                />
                            )}
                        />
                    </Box>
                ) : null}
                <Box>
                    <Typography
                        textAlign={{ xs: "left", md: "center" }}
                        marginBottom={device === 'mobile' ? "5px" : "0px"}
                        fontSize="14px"
                        fontWeight="600"
                    >
                        from date
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDatePicker
                            inputFormat="dd/MM/yyyy"
                            value={startDate}
                            disableFuture={true}
                            onChange={date => setStartDate(date)}
                            closeOnSelect
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
                                    sx={{ width: device === 'mobile' ? "100%" : '135px' }}
                                    className='my-date-picker'
                                    size='small'
                                    required
                                    {...params}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Box>
                <Box>
                    <Typography
                        textAlign={{ xs: "left", md: "center" }}
                        marginBottom={device === 'mobile' ? "5px" : "0px"}
                        fontSize="14px"
                        fontWeight="600"
                    >
                        to date
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDatePicker
                            inputFormat="dd/MM/yyyy"
                            value={endDate}
                            disableFuture={true}
                            closeOnSelect
                            onChange={date => setEndDate(date)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <InsertInvitationIcon fontSize='small' />
                                    </InputAdornment>
                                )
                            }}
                            renderInput={params => (
                                <TextField
                                    sx={{ width: device === 'mobile' ? "100%" : '135px' }}
                                    className='my-date-picker'
                                    size='small'
                                    required
                                    {...params}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Box>
                <Box marginTop={2.5}>
                    <Button type="submit" variant="contained" size="small" disabled={pending}>{!buttonTag ? "Apply Filter" : buttonTag}</Button>
                </Box>
            </Box>
        </form>
    )
}

export default Filters
