// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
