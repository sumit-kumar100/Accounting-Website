import axios from 'axios'
import { actions } from './store'
import { wrapper } from '../../redux/store'

export const getData = wrapper.getServerSideProps(
    (store) =>
        async (params) => {

            if (params.fetchUserCashOnly) {
                const response = await axios.post('/api/user/list/',
                    {
                        ...params,
                        matchWithId: true,
                        query: "fetchCashByUser"
                    }
                )
                store.dispatch(actions.updateUserCashData(response?.data?.data))
                return
            }

            const [cashReceiveData, cashPaidData, cashSaleData, cashPurchaseData, userCashData] = await axios.all([
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

            store.dispatch(actions.setInitialStore({
                cashReceiveData: cashReceiveData?.data?.data,
                cashPaidData: cashPaidData?.data?.data,
                cashSaleData: cashSaleData?.data?.data,
                cashPurchaseData: cashPurchaseData?.data?.data,
                userCashData: userCashData?.data?.data
            }))
        }
)


export const handleDebitCash = async (data, row, startDate, endDate) => {
    const response = row ? await axios.put('/api/auth-user/update-debit-user-cash', { ...data, _id: row?._id }) : await axios.put('/api/auth-user/create-debit-user-cash', { data })
    getData(
        {
            aggregate: true,
            startDate: startDate,
            endDate: endDate,
            fetchUserCashOnly: true
        }
    )
    return response
}

export const handleCreditCash = async (data, row, startDate, endDate) => {
    const response = row ? await axios.put('/api/auth-user/update-credit-user-cash', { ...data, _id: row?._id }) : await axios.put('/api/auth-user/create-credit-user-cash', { data })
    getData(
        {
            aggregate: true,
            startDate: startDate,
            endDate: endDate,
            fetchUserCashOnly: true
        }
    )
    return response
}

