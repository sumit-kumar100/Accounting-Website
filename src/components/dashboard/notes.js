import axios from 'axios'
import DataTable from '../datatable'
import Menu from '../menu'
import CloseIcon from '@mui/icons-material/Close'
import { deleteAlert } from '../alert'
import { fDate } from '../../utils/formatTime'
import { toast } from 'react-toastify'
import { Box, Typography, Tab, Button, IconButton, TextField } from '@mui/material'
import { useState, useEffect } from 'react'


export default function Notes({ setShow }) {

    const [text, setText] = useState("")

    const [notes, setNotes] = useState([])

    const [edit, setEdit] = useState(null)

    const fetchNotes = async () => {
        const response = await axios.post('/api/note/list')
        if (response?.data?.status) {
            setNotes(response.data.data)
        }
    }

    const handleDelete = async _id => {
        try {
            const confirm = await deleteAlert()
            if (confirm) {
                const response = await axios.delete('/api/note/', { data: { _id } })
                if (response?.data?.status) {
                    toast.warning(response.data.message)
                    fetchNotes()
                    return
                }
            }
            return false
        } catch (e) {
            toast.error(e?.response?.data?.error)
        }
    }

    const handleSubmit = async e => {
        e?.preventDefault()
        let response
        if (!edit) {
            response = await axios.post('/api/note',
                {
                    text: text,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            )
        } else {
            response = await axios.put('/api/note',
                {
                    _id: edit?._id,
                    text: text,
                    updated_at: new Date()
                }
            )
            setEdit(null)
        }
        if (response?.data?.status) {
            fetchNotes()
            toast.success(!edit ? "NOTE CREATED SUCCESSFULLY" : "NOTE UPDATED SUCCESSFULLY")
            setText("")
        }
    }

    useEffect(() => {
        fetchNotes()
    }, [])


    const columns = [
        {
            name: 'SNO.',
            cell: (row, index) => (
                <Box width="120px">
                    {`${index + 1}`}
                </Box>
            )
        },
        {
            name: 'Note',
            cell: row => (
                <Box width="120px">
                    {`${row.text}`}
                </Box>
            )
        },
        {
            name: 'Created At',
            cell: row => (
                <Box width="120px">
                    {`${fDate(row.created_at)}`}
                </Box>
            )
        },
        {
            name: 'Updated At',
            cell: row => (
                <Box width="120px">
                    {`${fDate(row.updated_at)}`}
                </Box>
            )
        },
        {
            name: "Edit",
            center: true,
            cell: row => (
                <Menu
                    onEdit={() => {
                        setText(row?.text)
                        setEdit(row)
                    }}
                    onDelete={() => handleDelete(row?._id)}
                />
            )
        }
    ]
    return (
        <Box sx={{ width: '100%' }}>
            <Typography textAlign="center">
                <Tab label="All Notes" />
            </Typography>
            <IconButton onClick={() => setShow(false)} sx={{ position: 'absolute', top: 5, right: 18, cursor: 'pointer' }} >
                <CloseIcon />
            </IconButton>

            <form onSubmit={handleSubmit}>

                <TextField
                    label="Write Note"
                    fullWidth
                    multiline
                    rows={4}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    focused
                />

                <Button variant='outlined' type='submit' size="small" sx={{ my: 2 }}>
                    {!edit ? "Add Note" : "Update Note"}
                </Button>

                <Button variant='outlined' size="small" sx={{ my: 2, mx: 2 }} onClick={() => {
                    setText("")
                    setEdit(null)
                }}>
                    Clear Note
                </Button>
            </form>

            {notes?.length ? (
                <DataTable
                    columns={columns}
                    data={notes}
                />
            ) : (
                <Typography fontWeight="400" fontSize={16} textAlign="center" mt={3} mb={1}>
                    No Records To Display
                </Typography>
            )}
        </Box>
    )
}
