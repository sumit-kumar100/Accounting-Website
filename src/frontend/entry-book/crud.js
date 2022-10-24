import axios from 'axios'
import { actions } from './store'
import { wrapper } from '../../redux/store'

export const getData = wrapper.getServerSideProps(
    (store) =>
        async (params) => {
            const response = await axios.post(`/api/entry/list/`, params)
            console.log(response)
            store.dispatch(actions.setEntryData(response?.data?.data || []))
        }
)

export const createRecord = async (data, fetchDataForDate) => {
    const response = await axios.post('/api/entry/', data)

    await getData({
        aggregate: true,
        query: "fetchEntry",
        startDate: new Date(fetchDataForDate),
        endDate: new Date(fetchDataForDate)
    })

    return response
}

export const updateRecord = async (data, fetchDataForDate) => {
    const response = await axios.put('/api/entry/', data)

    await getData({
        aggregate: true,
        query: "fetchEntry",
        startDate: new Date(fetchDataForDate),
        endDate: new Date(fetchDataForDate)
    })

    return response
}

export const deleteRecord = async (_id, fetchDataForDate) => {
    const response = await axios.delete(`/api/entry/`, { data: { _id } })

    await getData({
        aggregate: true,
        query: "fetchEntry",
        startDate: new Date(fetchDataForDate),
        endDate: new Date(fetchDataForDate)
    })

    return response
}
