import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import produceService from './produceService'

const initialState = {
  produce: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get all produce
export const getProduce = createAsyncThunk(
  'produce/getAll',
  async (_, thunkAPI) => {
    try {
      return await produceService.getProduce()
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

// Get produce by farmer
export const getProduceByFarmer = createAsyncThunk(
  'produce/getByFarmer',
  async (farmerId, thunkAPI) => {
    try {
      return await produceService.getProduceByFarmer(farmerId)
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

// Create new produce
export const createProduce = createAsyncThunk(
  'produce/create',
  async (produceData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await produceService.createProduce(produceData, token)
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

export const produceSlice = createSlice({
  name: 'produce',
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
      .addCase(getProduce.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProduce.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.produce = action.payload
      })
      .addCase(getProduce.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getProduceByFarmer.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProduceByFarmer.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.produce = action.payload
      })
      .addCase(getProduceByFarmer.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createProduce.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createProduce.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        // Add the new produce to the array if it doesn't already exist
        if (!state.produce.some(item => item._id === action.payload._id)) {
          state.produce.push(action.payload)
        }
      })
      .addCase(createProduce.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = produceSlice.actions
export default produceSlice.reducer