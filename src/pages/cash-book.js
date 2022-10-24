import Axios from 'axios'
import createAxios from '../utils/createAxios'
import cookie from 'cookie'
import decode from 'jwt-decode'
import dynamic from 'next/dynamic'
import requireAuthentication from '../utils/requireAuthentication'
import { userActions } from '../redux/user'
import { getData } from '../frontend/cash-book/crud'
import { wrapper } from '../redux/store'
import { actions } from '../frontend/cash-book/store'
import { Container, Box } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'

const AdminDashboardLayout = dynamic(() => import('../components/dashboard'), { ssr: true })

const ViewCash = dynamic(() => import('../frontend/cash-book'), { ssr: true })

const CashBook = (props) => {

    const dispatch = useDispatch()

    const state = useSelector(state => state.cash)

    const { user } = useSelector(state => state.user)

    return (
        <AdminDashboardLayout>
            <Container maxWidth={false}>
                <Box sx={{ p: 2, background: '#ffffff' }}>
                    <ViewCash
                        state={state}
                        dispatch={dispatch}
                        getData={getData}
                        user={user}
                    />
                </Box>
            </Container>
        </AdminDashboardLayout>
    )
}

export default CashBook



export const getServerSideProps = wrapper.getServerSideProps(
    (store) =>
        requireAuthentication(async (context) => {
            const { req, res } = context
            try {
                const axios = createAxios(req.cookies.accessToken)
                const params = {
                    aggregate: true,
                    startDate: new Date(),
                    endDate: new Date()
                }
                const [cashReceiveData, cashPaidData, cashSaleData, cashPurchaseData, userCashData] = await Axios.all([
                    axios.post('/api/customer/list/',
                        {
                            ...params,
                            query: "fetchCashReceive"
                        }
                    ),
                    axios.post('/api/vendor/list/',
                        {
                            ...params,
                            query: "fetchCashPaid"
                        }
                    ),
                    axios.post('/api/entry/list/',
                        {
                            ...params,
                            query: "fetchCashSale"
                        }
                    ),
                    axios.post('/api/entry/list/',
                        {
                            ...params,
                            query: "fetchCashPurchase"
                        }
                    ),
                    axios.post('/api/user/list/',
                        {
                            ...params,
                            matchWithId: true,
                            query: "fetchCashByUser"
                        }
                    ),
                ])
                store.dispatch(actions.setInitialStore(
                    {
                        cashReceiveData: cashReceiveData?.data?.data,
                        cashPaidData: cashPaidData?.data?.data,
                        cashSaleData: cashSaleData?.data?.data,
                        cashPurchaseData: cashPurchaseData?.data?.data,
                        userCashData: userCashData?.data?.data
                    }
                ))
                store.dispatch(userActions.setUser(decode(req.cookies.accessToken)))
            }
            catch (e) {
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
