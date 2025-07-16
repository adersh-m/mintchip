import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import transactionReducer from '../features/transactions/transactionsSlice';
import { transactionApi } from '../features/transactions/api';

/**
 * Configure root Redux store.
 * Add additional feature reducers in the reducer map as they are created.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(transactionApi.middleware),
  devTools: import.meta.env.DEV,
});

/** Infer RootState and AppDispatch from the store itself */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
