import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Budget } from "./types";

export const budgetApi = createApi({
    reducerPath: 'budgetApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/budgets' }),
    tagTypes: ['Budgets'],
    endpoints: (builder) => ({
        getBudgets: builder.query<Budget[], string>({
            query: (month) => `/budgets?month=${month}`,
            providesTags: ['Budgets'],
        }),
        createBudget: builder.mutation<Budget, Partial<Budget>>({
            query: (budget) => ({
                url: '/budgets',
                method: 'POST',
                body: budget,
            }),
            invalidatesTags: ['Budgets'],
        }),
    }),
});

export const { useGetBudgetsQuery, useCreateBudgetMutation } = budgetApi;