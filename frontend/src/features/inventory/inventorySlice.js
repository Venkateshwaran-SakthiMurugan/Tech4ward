import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import inventoryService from './inventoryService'

const initialState = {
  inventory: [],
  topVillages: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get inventory
export const getInventory = createAsyncThunk(
  'inventory/getAll',
  async (_, thunkAPI) => {
    try {
      return await inventoryService.getInventory()
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get inventory by village
export const getInventoryByVillage = createAsyncThunk(
  'inventory/getByVillage',
  async (villageId, thunkAPI) => {
    try {
      return await inventoryService.getInventoryByVillage(villageId)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get top contributing villages
export const getTopVillages = createAsyncThunk(
  'inventory/getTopVillages',
  async (_, thunkAPI) => {
    try {
      return await inventoryService.getTopVillages()
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInventory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getInventory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.inventory = action.payload
      })
      .addCase(getInventory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getInventoryByVillage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getInventoryByVillage.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.inventory = action.payload
      })
      .addCase(getInventoryByVillage.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getTopVillages.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTopVillages.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.topVillages = action.payload
      })
      .addCase(getTopVillages.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = inventorySlice.actions
export default inventorySlice.reducer