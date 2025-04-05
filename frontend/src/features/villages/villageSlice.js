import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import villageService from './villageService'

const initialState = {
  villages: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get all villages
export const getVillages = createAsyncThunk(
  'villages/getAll',
  async (_, thunkAPI) => {
    try {
      return await villageService.getVillages()
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

// Create new village
export const createVillage = createAsyncThunk(
  'villages/create',
  async (villageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await villageService.createVillage(villageData, token)
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

export const villageSlice = createSlice({
  name: 'villages',
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
      .addCase(getVillages.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getVillages.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.villages = action.payload
      })
      .addCase(getVillages.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createVillage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createVillage.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.villages.push(action.payload)
      })
      .addCase(createVillage.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = villageSlice.actions
export default villageSlice.reducer