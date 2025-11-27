import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import taskReducer from './taskSlice';

//Guardamos los reducers en el store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
});