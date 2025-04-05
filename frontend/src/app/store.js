import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import villageReducer from '../features/villages/villageSlice'
import farmerReducer from '../features/farmers/farmerSlice'
import produceReducer from '../features/produce/produceSlice'
import inventoryReducer from '../features/inventory/inventorySlice'
import orderReducer from '../features/orders/orderSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    villages: villageReducer,
    farmers: farmerReducer,
    produce: produceReducer,
    inventory: inventoryReducer,
    orders: orderReducer,
  },
})