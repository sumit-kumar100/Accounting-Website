import cookie from 'cookie'
import createAxios from '../utils/createAxios'
import requireAuthentication from '../utils/requireAuthentication'
import decode from 'jwt-decode'
import dynamic from 'next/dynamic'
import { userActions } from '../redux/user'
import { wrapper } from '../redux/store'
import { Container, Box } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { actions } from '../frontend/purchase-ledger/store'
import { getData } from '../frontend/purchase-ledger/crud'

const AdminDashboardLayout = dynamic(() => import('../components/dashboard'), { ssr: true })

const ViewPurchaseLedger = dynamic(() => import('../frontend/purchase-ledger'), { ssr: true })

const PurchaseLedger = (props) => {

    const dispatch = useDispatch()

    const state = useSelector(state => state.purchaseLedger)

    const { user } = useSelector(state => state.user)

    return (
        <AdminDashboardLayout>
            <Container maxWidth={false}>
                <Box sx={{ p: 2, background: '#ffffff' }}>
                    <ViewPurchaseLedger
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

export default PurchaseLedger



export const getServerSideProps = wrapper.getServerSideProps(
    (store) =>
        requireAuthentication(async (context) => {
            const { req, res } = context
            try {
                const axios = createAxios(req.cookies.accessToken)
                const vendors = await axios.post('/api/vendor/list/',
                    {
                        conditions: {
                            status: true
                        },
                        fields: ['_id', 'name']
                    }
                )
                store.dispatch(actions.setInitialStore({ vendors: vendors?.data?.data }))
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
