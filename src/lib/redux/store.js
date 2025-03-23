import { configureStore } from '@reduxjs/toolkit';
import configReducer from './configSlice'
const rootReducer = {
    config: configReducer,
  };
  
  export default configureStore({
    reducer: rootReducer,
  });
  