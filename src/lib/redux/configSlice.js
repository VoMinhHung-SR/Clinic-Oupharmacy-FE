import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import APIs, { endpoints } from '../../config/APIs';

const getAllConfig = createAsyncThunk(
    'config/getAllConfig',
    async (_, thunkAPI) => {
      try {
        const resData = await APIs.get(endpoints['common-configs']);
        return resData.data;
      } catch (error) {
        throw error;
      }
    },
);

export const configSlice = createSlice({
    name: 'config',
    initialState: { allConfig: {} },
    reducers: {},
    extraReducers: builder => {
      builder.addCase(getAllConfig.fulfilled, (state, action) => {
        state.allConfig = action.payload;
      });
    },
  });
  
  const {reducer} = configSlice;
  
  export default reducer;

  export {getAllConfig};
  