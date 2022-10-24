import axios from 'axios'
import { actions } from './store'
import { wrapper } from '../../redux/store'

export const getData = wrapper.getServerSideProps(
    (store) =>
        async (params) => {
            const [saleLedgerData, customerLedgerData] = await axios.all([
                axios.post("/api/entry/list/", {
                    ...params,
                    query: 'fetchSaleLedger'
                }),
                axios.post("/api/customer/list", {
                    ...params,
                    query: 'fetchSaleCustomerLedger'
                })
            ])
            store.dispatch(actions.setData({
                customerLedgerData: customerLedgerData?.data?.data[0],
                saleLedgerData: saleLedgerData?.data?.data
            }))
        }
)