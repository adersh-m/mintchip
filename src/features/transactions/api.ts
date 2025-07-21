import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Transaction } from './types';

export const transactionApi = createApi({
    reducerPath: 'transactionApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Transaction', 'Budgets'], // 👈 Add Budgets tag type for cross-invalidation
    endpoints: (builder) => ({
        getTransactions: builder.query<Transaction[], string>({
            query: (monthIso) => `transactions?month=${monthIso}`,
            providesTags: (result = []) =>
                result
                    ?
                    [...result.map(({ id }) => ({ type: 'Transaction' as const, id })), { type: 'Transaction', id: 'PARTIAL-LIST' }]
                    : [{ type: 'Transaction', id: 'PARTIAL-LIST' }],
        }),
        createTransaction: builder.mutation<Transaction, Partial<Transaction>>({
            query: (transaction) => ({
                url: 'transactions',
                method: 'POST',
                body: transaction,
            }),
            invalidatesTags: [
                { type: 'Transaction', id: 'PARTIAL-LIST' },
                'Budgets', // 👈 Also invalidate budgets since spending affects budgets
            ],
        }),
    }),
});

export const { useGetTransactionsQuery, useCreateTransactionMutation } = transactionApi;