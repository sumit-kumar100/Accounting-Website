import entry from '../frontend/entry-book/store'
import purchases from '../frontend/purchase-book/store'
import sales from '../frontend/sale-book/store'
import purchaseLedger from '../frontend/purchase-ledger/store'
import saleLedger from '../frontend/sale-ledger/store'
import cash from '../frontend/cash-book/store'
import user from './user'
import { HYDRATE } from 'next-redux-wrapper'
import { combineReducers } from '@reduxjs/toolkit'

const combinedReducers = combineReducers({
  entry,
  purchases,
  sales,
  purchaseLedger,
  saleLedger,
  cash,
  user
})

const masterReducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload
    }
    return nextState
  } else {
    return combinedReducers(state, action)
  }
}

export default masterReducer
