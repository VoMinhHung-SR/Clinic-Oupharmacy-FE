import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi, endpoints } from "../../config/APIs";

const getUserInfo = createAsyncThunk(
    'user/getUserInfo',
    async (_, thunkAPI) => {
      try {
        const resData = await authApi().get(endpoints['current-user']);
  
        return resData.data;
      } catch (error) {
        throw error;
      }
    }
  );
  
  const removeUserInfo = createAsyncThunk(
    'user/removeUserInfo',
    async (accessToken, thunkAPI) => {
      try {
        // TODO: Remove Cookie
        // await authService.revokToken(accessToken);
  
        // const removeResult =
        //   tokenService.removeAccessTokenAndRefreshTokenFromCookie();
  
        if (!removeResult) {
          return Promise.reject("Can't remove token in Cookie");
        }
      } catch (error) {
        throw error;
      }
    }
  );
  
