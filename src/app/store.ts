import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

/**
 * Configure root Redux store.
 * Add additional feature reducers in the reducer map as they are created.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});

/** Infer RootState and AppDispatch from the store itself */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
