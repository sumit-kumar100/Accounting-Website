import masterReducers from './masterReducer'
import { createWrapper } from 'next-redux-wrapper'
import { configureStore } from '@reduxjs/toolkit'


export const store = () => (
  configureStore({
    reducer: masterReducers
  })
)

export const wrapper = createWrapper(store)