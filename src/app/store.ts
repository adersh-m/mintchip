import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import transactionReducer from '../features/transactions/transactionsSlice';
import budgetReducer from '../features/budgets/budgetsSlice';
import { transactionApi } from '../features/transactions/api';
import { budgetApi } from '../features/budgets/api';
import { reportsApi } from '../features/reports/api';

/**
 * Configure root Redux store.
 * Add additional feature reducers in the reducer map as they are created.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    budgets: budgetReducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [budgetApi.reducerPath]: budgetApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(transactionApi.middleware, budgetApi.middleware, reportsApi.middleware),
  devTools: import.meta.env.DEV,
});

/** Infer RootState and AppDispatch from the store itself */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
