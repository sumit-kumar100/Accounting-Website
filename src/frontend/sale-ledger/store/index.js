import { createSlice } from "@reduxjs/toolkit"


export const saleLedgerSlice = createSlice({
    name: 'saleLedger',
    initialState: {
        message: null,
        loading: 'idle',
        currentRequestId: null,
        saleLedgerData: [],
        customerLedgerData: [],
        customers: []
    },
    reducers: {
        setInitialStore: (state, action) => {
            state.customers = action?.payload?.customers || []
        },
        setData: (state, action) => {
            state.customerLedgerData = action?.payload?.customerLedgerData || []
            state.saleLedgerData = action?.payload?.saleLedgerData || []
        },
        setCustomerLedgerData: (state, action) => {
            state.customerLedgerData = action?.payload || []

        },
        updateMessage: (state, action) => {
            state.message = action.payload
        },
        clearMessage: state => {
            state.message = null
        }
    }
})

export const actions = saleLedgerSlice.actions

export default saleLedgerSlice.reducer
