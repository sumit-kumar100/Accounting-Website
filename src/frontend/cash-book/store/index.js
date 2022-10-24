import { createSlice } from "@reduxjs/toolkit"

export const cashSlice = createSlice({
    name: 'cash',
    initialState: {
        message: null,
        cashReceiveData: [],
        cashPaidData: [],
        cashSaleData: [],
        cashPurchaseData: [],
        userCashData: []
    },
    reducers: {
        setInitialStore: (state, action) => {
            state.cashReceiveData = action?.payload?.cashReceiveData || []
            state.cashPaidData = action?.payload?.cashPaidData || []
            state.cashSaleData = action?.payload?.cashSaleData || []
            state.cashPurchaseData = action?.payload?.cashPurchaseData || []
            state.userCashData = action?.payload?.userCashData || []
        },
        updateUserCashData: (state, action) => {
            state.userCashData = action?.payload || []
        },
        updateMessage: (state, action) => {
            state.message = action.payload
        },
        clearMessage: state => {
            state.message = null
        }
    }
})

export const actions = cashSlice.actions

export default cashSlice.reducer
