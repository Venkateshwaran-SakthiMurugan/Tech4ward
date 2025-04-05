import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import farmerService from './farmerService'

const initialState = {
  farmers: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get all farmers
export const getFarmers = createAsyncThunk(
  'farmers/getAll',
  async (_, thunkAPI) => {
    try {
      return await farmerService.getFarmers()
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

// Get farmers by village
export const getFarmersByVillage = createAsyncThunk(
  'farmers/getByVillage',
  async (villageId, thunkAPI) => {
    try {
      return await farmerService.getFarmersByVillage(villageId)
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

// Create new farmer
export const createFarmer = createAsyncThunk(
  'farmers/create',
  async (farmerData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await farmerService.createFarmer(farmerData, token)
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

export const farmerSlice = createSlice({
  name: 'farmers',
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
      .addCase(getFarmers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getFarmers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.farmers = action.payload
      })
      .addCase(getFarmers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getFarmersByVillage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getFarmersByVillage.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.farmers = action.payload
      })
      .addCase(getFarmersByVillage.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createFarmer.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createFarmer.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.farmers.push(action.payload)
      })
      .addCase(createFarmer.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = farmerSlice.actions
export default farmerSlice.reducer