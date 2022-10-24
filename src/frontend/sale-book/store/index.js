import { createSlice } from "@reduxjs/toolkit"

export const saleSlice = createSlice({
    name: 'sales',
    initialState: {
        message: null,
        loading: 'idle',
        currentRequestId: null,
        saleData: [],
        customers: []
    },
    reducers: {
        setInitialStore: (state, action) => {
            state.customers = action?.payload?.customers || []
            state.saleData = action?.payload?.saleData || []
        },
        setSaleData: (state, action) => {
            state.saleData = action?.payload || []
        },
        updateMessage: (state, action) => {
            state.message = action.payload
        },
        clearMessage: state => {
            state.message = null
        }
    }
})

export const actions = saleSlice.actions

export default saleSlice.reducer
