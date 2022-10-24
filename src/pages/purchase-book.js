import createAxios from '../utils/createAxios'
import requireAuthentication from '../utils/requireAuthentication'
import cookie from 'cookie'
import decode from 'jwt-decode'
import dynamic from 'next/dynamic'
import { userActions } from '../redux/user'
import { wrapper } from '../redux/store'
import { Box, Container } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { actions } from '../frontend/purchase-book/store'
import { getData } from '../frontend/purchase-book/crud'

const AdminDashboardLayout = dynamic(() => import('../components/dashboard'), { ssr: true })

const ViewPurchases = dynamic(() => import('../frontend/purchase-book'), { ssr: true })

const PurchasesBook = () => {

    const dispatch = useDispatch()

    const state = useSelector(state => state.purchases)

    return (
        <AdminDashboardLayout>
            <Container maxWidth={false}>
                <Box sx={{ p: 2, background: '#ffffff' }}>
                    <ViewPurchases
                        state={state}
                        actions={actions}
                        dispatch={dispatch}
                        getData={getData}
                    />
                </Box>
            </Container>
        </AdminDashboardLayout>
    )
}

export default PurchasesBook


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
                        fields: [
                            '_id',
                            'name'
                        ]
                    }
                )
                const purchases = await axios.post('/api/entry/list/',
                    {
                        aggregate: true,
                        query: "fetchPurchase",
                        startDate: new Date(),
                        endDate: new Date()
                    }
                )
                store.dispatch(actions.setInitialStore(
                    {
                        vendors: vendors?.data?.data,
                        purchaseData: purchases?.data?.data
                    }
                ))
                store.dispatch(userActions.setUser(decode(req.cookies.accessToken)))

            } catch (e) {
                res.setHeader(
                    'Set-Cookie',
                    cookie.serialize(
                        'accessToken',
                        "",
                        {
                            httpOnly: true,
                            expires: new Date(0),
                            sameSite: 'strict',
                            path: '/'
                        }
                    )
                )
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
