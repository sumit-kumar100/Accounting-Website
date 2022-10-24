import MenuPopover from '../../components/menuPopover'
import HighLight from 'react-highlighter'
import EditIcon from '@mui/icons-material/Edit'
import { useRef, useState, useEffect } from 'react'
import { FormControl, TextField, Button, Box } from '@mui/material'

export default function Charges({ search, additionalCost, handleCharges }) {

    const anchorRef = useRef(null)

    const [open, setOpen] = useState(false)

    const [charges, setCharges] = useState(0)

    const [pending, setPending] = useState(false)

    useEffect(() => setCharges(parseInt(additionalCost)), [additionalCost])

    const addCharges = async () => {
        setPending(true)
        await handleCharges(charges)
        setPending(false)
        setOpen(false)
    }

    return (
        <>
            <span
                style={{
                    color: '#2065D1',
                    cursor: 'pointer'
                }}
                ref={anchorRef}
                onClick={() => setOpen(true)}
            >
                <HighLight search={search}>
                    {`₹ ${additionalCost} `}<EditIcon sx={{ fontSize: 12, marginBottom: -0.1 }} />
                </HighLight>

            </span>

            <MenuPopover
                open={open}
                onClose={() => setOpen(false)}
                anchorEl={anchorRef.current}
                sx={{
                    mt: 1.5,
                    ml: 0.75,
                    width: 170,
                    '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
                }}
            >
                <Box display="flex" gap={1}>
                    <FormControl variant="outlined">
                        <TextField
                            value={charges}
                            size="small"
                            placeholder='Charges'
                            type='number'
                            className='my-text-input'
                            InputProps={{ inputProps: { min: 0 } }}
                            onChange={e => setCharges(e.target.value)}
                        />
                    </FormControl>
                    <Button size="small" disabled={pending} variant="outlined" color="secondary" onClick={addCharges}>Add</Button>
                </Box>
            </MenuPopover>
        </>
    )
}
