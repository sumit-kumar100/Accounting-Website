import axios from 'axios'
import { deleteAlert } from '../../components/alert'
import { toast } from "react-toastify"


export const getData = async params => {
    const response = await axios.post('/api/vendor/list/', params)
    if (response?.data?.status) {
        return response
    }
}


export const createRecord = async vendor => {
    try {
        const response = await axios.post('/api/vendor/', { name: vendor.name })
        if (response?.data?.status) {
            toast.success("Vendor Created Successfully")
            const resp = await getData({ fields: ['_id', 'name', 'status'] })
            return resp
        }
        return false
    } catch (e) {
        toast.error(e?.response?.data?.error)
    }
}

export const updateRecord = async vendor => {
    try {
        const response = await axios.put(`/api/vendor/`, { _id: vendor._id, name: vendor.name, status: true, updateName: true })
        if (response?.data?.status) {
            toast.success("Vendor Updated Successfully")
            const resp = await getData({ fields: ['_id', 'name', 'status'] })
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
            const response = await axios.delete('/api/vendor/', { data: { _id, name } })
            if (response?.data?.status) {
                toast.warning(response.data.message)
                const resp = await getData({ fields: ['_id', 'name', 'status'] })
                return resp
            }
        }
        return false
    } catch (e) {
        toast.error(e?.response?.data?.error)
    }
}
