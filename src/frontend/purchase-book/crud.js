import axios from 'axios'
import { actions } from './store'
import { wrapper } from '../../redux/store'

export const getData = wrapper.getServerSideProps(
    (store) =>
        async (params) => {
            const response = await axios.post("/api/entry/list/", params)
            store.dispatch(actions.setPurchaseData(response?.data?.data || []))
        }
)