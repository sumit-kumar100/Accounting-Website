import { createSlice } from "@reduxjs/toolkit"

export const purchaseSlice = createSlice({
    name: 'purchases',
    initialState: {
        message: null,
        loading: 'idle',
        currentRequestId: null,
        purchaseData: [],
        vendors: []
    },
    reducers: {
        setInitialStore: (state, action) => {
            state.vendors = action?.payload?.vendors || []
            state.purchaseData = action?.payload?.purchaseData || []
        },
        setPurchaseData: (state, action) => {
            state.purchaseData = action?.payload || []
        },
        updateMessage: (state, action) => {
            state.message = action.payload
        },
        clearMessage: state => {
            state.message = null
        }
    }
})

export const actions = purchaseSlice.actions

export default purchaseSlice.reducer
