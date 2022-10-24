import { createSlice } from "@reduxjs/toolkit"


export const purchaseLedgerSlice = createSlice({
    name: 'purchaseLedger',
    initialState: {
        message: null,
        loading: 'idle',
        currentRequestId: null,
        purchaseLedgerData: [],
        vendorLedgerData: [],
        vendors: []
    },
    reducers: {
        setInitialStore: (state, action) => {
            state.vendors = action?.payload?.vendors || []
        },
        setData: (state, action) => {
            state.vendorLedgerData = action?.payload?.vendorLedgerData || []
            state.purchaseLedgerData = action?.payload?.purchaseLedgerData || []
        },
        setVendorLedgerData: (state, action) => {
            state.vendorLedgerData = action?.payload || []

        },
        updateMessage: (state, action) => {
            state.message = action.payload
        },
        clearMessage: state => {
            state.message = null
        }
    }
})

export const actions = purchaseLedgerSlice.actions

export default purchaseLedgerSlice.reducer
