import InsertInvitationIcon from '@mui/icons-material/InsertInvitation'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Box, TextField, InputAdornment, FormControl, OutlinedInput } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

const Filters = ({ getData, search, setSearch, date, setDate }) => {

    const applyFilter = async date => {
        setDate(date)
        await getData({
            aggregate: true,
            query: "fetchEntry",
            startDate: new Date(date),
            endDate: new Date(date)
        })
    }

    return (
        <Box display="flex" justifyContent="space-between" marginBottom={2}>
            <Box>
                <FormControl variant="outlined" sx={{ width: { xs: '150px', md: '200px' } }}>
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
            <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDatePicker
                        inputFormat="dd/MM/yyyy"
                        value={date}
                        disableFuture={true}
                        onChange={applyFilter}
                        closeOnSelect
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <InsertInvitationIcon fontSize='small' />
                                </InputAdornment>
                            )
                        }}
                        renderInput={params => (
                            <TextField
                                sx={{ width: { xs: '135px', md: '145px' } }}
                                className='my-date-picker'
                                size='small'
                                {...params}
                            />
                        )}
                    />
                </LocalizationProvider>
            </Box>
        </Box>

    )
}


export default Filters