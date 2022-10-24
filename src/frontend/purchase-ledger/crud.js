import axios from 'axios'
import { actions } from './store'
import { wrapper } from '../../redux/store'

export const getData = wrapper.getServerSideProps(
    (store) =>
        async (params) => {
            const [purchaseLedgerData, vendorLedgerData] = await axios.all([
                axios.post("/api/entry/list/", {
                    ...params,
                    query: 'fetchPurchaseLedger'
                }),
                axios.post("/api/vendor/list", {
                    ...params,
                    query: 'fetchPurchaseVendorLedger'
                })
            ])
            store.dispatch(actions.setData({
                vendorLedgerData: vendorLedgerData?.data?.data[0],
                purchaseLedgerData: purchaseLedgerData?.data?.data
            }))
        }
)