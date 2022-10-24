import { createSlice } from "@reduxjs/toolkit"

export const entrySlice = createSlice({
    name: 'entry',
    initialState: {
        message: null,
        entryData: []
    },
    reducers: {
        setInitialStore: (state, action) => {
            state.entryData = action?.payload?.entryData || []
        },
        setEntryData: (state, action) => {
            state.entryData = action?.payload || []
        },
        updateMessage: (state, action) => {
            state.message = action.payload
        },
        clearMessage: state => {
            state.message = null
        }
    }
})

export const actions = entrySlice.actions

export default entrySlice.reducer
