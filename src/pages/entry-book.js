import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import requireAuthentication from '../utils/requireAuthentication'
import cookie from 'cookie'
import decode from 'jwt-decode'
import createAxios from '../utils/createAxios'
import dynamic from 'next/dynamic'
import { userActions } from '../redux/user'
import { wrapper } from '../redux/store'
import { toast } from "react-toastify"
import { Box, Container, Button, Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { actions } from '../frontend/entry-book/store'
import { createRecord, getData, updateRecord, deleteRecord } from '../frontend/entry-book/crud'

const AddEntry = dynamic(() => import('../frontend/entry-book/addEntry'), { ssr: true })

const ViewEntry = dynamic(() => import('../frontend/entry-book/viewEntry'), { ssr: true })

const AdminDashboardLayout = dynamic(() => import('../components/dashboard'), { ssr: true })

const EntryBook = () => {

    const dispatch = useDispatch()

    const state = useSelector(state => state.entry)

    const { user } = useSelector(state => state.user)

    const [edit, setEdit] = useState(null)

    const [date, setDate] = useState(new Date())

    const [expanded, setExpanded] = useState(null)

    useEffect(() => {
        if (state?.message) {
            if (state.message === "Entry Created Successfully" || state.message === "Entry Updated Successfully") {
                toast.success(state.message)
            }
            else if (state.message === "Entry Deleted Successfully") {
                toast.warning(state.message)
            }
            else if (state.message === "Internal Servor Error") {
                toast.error(state.message)
            }
            else {
                toast.info("Something Went Wrong")
            }
            dispatch(actions.clearMessage())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state?.message])

    return (
        <AdminDashboardLayout>
            <Container maxWidth={false}>
                <Accordion sx={{ mb: 2 }} expanded={expanded} onChange={() => setExpanded(!expanded)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Button
                            variant="text"
                            color="primary"
                            component="span"
                        >
                            Add Entry +
                        </Button>
                    </AccordionSummary>
                    <AccordionDetails>
                        <AddEntry
                            createRecord={createRecord}
                            updateRecord={updateRecord}
                            dispatch={dispatch}
                            edit={edit}
                            setEdit={setEdit}
                            date={date}
                            setDate={setDate}
                            setExpanded={setExpanded}
                            actions={actions}
                            user={user}
                        />
                    </AccordionDetails>
                </Accordion>
                <Box sx={{ p: 2, background: '#ffffff' }}>
                    <ViewEntry
                        state={state}
                        setEdit={setEdit}
                        deleteRecord={deleteRecord}
                        dispatch={dispatch}
                        getData={getData}
                        date={date}
                        setDate={setDate}
                        actions={actions}
                    />
                </Box>
            </Container>
        </AdminDashboardLayout>
    )
}

export default EntryBook

export const getServerSideProps = wrapper.getServerSideProps(
    (store) =>
        requireAuthentication(async (context) => {
            const { req, res } = context
            try {
                const axios = createAxios(req.cookies.accessToken)
                const entryData = await axios.post(`/api/entry/list/`,
                    {
                        aggregate: true,
                        query: "fetchEntry",
                        startDate: new Date(),
                        endDate: new Date()
                    }
                )
                store.dispatch(actions.setInitialStore(
                    {
                        entryData: entryData?.data?.data
                    }
                ))
                store.dispatch(userActions.setUser(decode(req.cookies.accessToken)))

            } catch (e) {
                res.setHeader('Set-Cookie', cookie.serialize('accessToken', "",
                    {
                        httpOnly: true,
                        expires: new Date(0),
                        sameSite: 'strict',
                        path: '/'
                    }
                ))
                return {
                    redirect: {
                        destination: '/login',
                        statusCode: 302
                    }
                }
            }
            return { props: {} }
        })
)