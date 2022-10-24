import cookie from 'cookie'
import createAxios from '../utils/createAxios'
import requireAuthentication from '../utils/requireAuthentication'
import decode from 'jwt-decode'
import dynamic from 'next/dynamic'
import { wrapper } from '../redux/store'
import { userActions } from '../redux/user'
import { Container, Box } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { actions } from '../frontend/sale-ledger/store'
import { getData } from '../frontend/sale-ledger/crud'

const AdminDashboardLayout = dynamic(() => import('../components/dashboard'), { ssr: true })

const ViewSaleLedger = dynamic(() => import('../frontend/sale-ledger'), { ssr: true })

const SaleLedger = (props) => {

    const dispatch = useDispatch()

    const state = useSelector(state => state.saleLedger)

    const { user } = useSelector(state => state.user)

    return (
        <AdminDashboardLayout>
            <Container maxWidth={false}>
                <Box sx={{ p: 2, background: '#ffffff' }}>
                    <ViewSaleLedger
                        state={state}
                        actions={actions}
                        dispatch={dispatch}
                        getData={getData}
                        user={user}
                    />
                </Box>
            </Container>
        </AdminDashboardLayout>
    )
}

export default SaleLedger



export const getServerSideProps = wrapper.getServerSideProps(
    (store) =>
        requireAuthentication(async (context) => {
            const { req, res } = context
            const axios = createAxios(req.cookies.accessToken)
            try {
                const customers = await axios.post('/api/customer/list/',
                    {
                        conditions: {
                            status: true
                        },
                        fields: ['_id', 'name', 'type']
                    }
                )
                store.dispatch(actions.setInitialStore({ customers: customers?.data?.data }))
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
