import cookie from 'cookie'
import createAxios from '../utils/createAxios'
import requireAuthentication from '../utils/requireAuthentication'
import decode from 'jwt-decode'
import dynamic from 'next/dynamic'
import { userActions } from '../redux/user'
import { wrapper } from '../redux/store'
import { Box, Container } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { actions } from '../frontend/sale-book/store'
import { getData } from '../frontend/sale-book/crud'

const AdminDashboardLayout = dynamic(() => import('../components/dashboard'), { ssr: true })

const ViewSales = dynamic(() => import('../frontend/sale-book'), { ssr: true })

const SalesBook = () => {

    const dispatch = useDispatch()

    const state = useSelector(state => state.sales)

    return (
        <AdminDashboardLayout>
            <Container maxWidth={false}>
                <Box sx={{ p: 2, background: '#ffffff' }}>
                    <ViewSales
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

export default SalesBook


export const getServerSideProps = wrapper.getServerSideProps(
    (store) =>
        requireAuthentication(async (context) => {
            const { req, res } = context
            try {
                const axios = createAxios(req.cookies.accessToken)
                const customers = await axios.post('/api/customer/list/',
                    {
                        conditions: {
                            status: true
                        },
                        fields: ['_id', 'name']
                    }
                )
                const sales = await axios.post(`/api/entry/list/`,
                    {
                        aggregate: true,
                        query: "fetchSale",
                        startDate: new Date(),
                        endDate: new Date()
                    }
                )
                store.dispatch(actions.setInitialStore({
                    customers: customers?.data?.data,
                    saleData: sales?.data?.data
                }))
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
