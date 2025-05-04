import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice'; // Ensure this path is correct relative to store.ts

// Configure the Redux store
export const store = configureStore({
  reducer: {
    chat: chatReducer, // Add the chat slice reducer
  },
});

// Define RootState and AppDispatch types for better type safety
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// This line might be causing issues if not used elsewhere, but it's generally good practice
// to export it if you need to use the dispatch type in other parts of your app.
// export type AppDispatch = typeof store.dispatch;
