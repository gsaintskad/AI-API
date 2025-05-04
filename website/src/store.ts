import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    chat: chatReducer, // Add the chat slice reducer
  },
});

// Define RootState and AppDispatch types for better type safety
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
