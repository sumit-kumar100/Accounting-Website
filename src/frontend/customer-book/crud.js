import axios from 'axios'
import { deleteAlert } from '../../components/alert'
import { toast } from "react-toastify"

export const getData = async params => {
    const response = await axios.post('/api/customer/list/', params)
    if (response?.data?.status) {
        return response
    }
}

export const createRecord = async customer => {
    try {
        const response = await axios.post('/api/customer/', { name: customer.name })
        if (response?.data?.status) {
            toast.success("Customer Created Successfully")
            const resp = await getData({ conditions: { type: "ACCOUNT" }, fields: ['_id', 'name', 'status'] })
            return resp
        }
        return false
    } catch (e) {
        toast.error(e?.response?.data?.error)
    }
}

export const updateRecord = async customer => {
    try {
        const response = await axios.put(`/api/customer/`, { _id: customer._id, name: customer.name, status: true, updateName: true })
        if (response?.data?.status) {
            toast.success("Customer Updated Successfully")
            const resp = await getData({ conditions: { type: "ACCOUNT" }, fields: ['_id', 'name', 'status'] })
            return resp
        }
        return false
    } catch (e) {
        toast.error(e?.response?.data?.error)
    }
}

export const deleteRecord = async (_id, name) => {
    try {
        const confirm = await deleteAlert()
        if (confirm) {
            const response = await axios.delete('/api/customer/', { data: { _id, name } })
            if (response?.data?.status) {
                toast.warning(response.data.message)
                const resp = await getData({ conditions: { type: "ACCOUNT" }, fields: ['_id', 'name', 'status'] })
                return resp
            }
        }
        return false
    } catch (e) {
        toast.error(e?.response?.data?.error)
    }
}
