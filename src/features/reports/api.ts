import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CategoryReport, TimelineReport, ReportParams } from './types';

export const reportsApi = createApi({
    reducerPath: 'reportsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['CategoryReport', 'TimelineReport'],
    endpoints: (builder) => ({
        getCategoryReport: builder.query<CategoryReport, ReportParams>({
            query: ({ startDate, endDate, category }) => {
                const params = new URLSearchParams({
                    startDate,
                    endDate,
                    ...(category && { category }),
                });
                return `reports/category?${params}`;
            },
            providesTags: (_result, _error, { startDate, endDate, category }) => [
                { type: 'CategoryReport', id: `${startDate}-${endDate}-${category || 'all'}` },
                { type: 'CategoryReport', id: 'LIST' },
            ],
        }),
        getTimelineReport: builder.query<TimelineReport, ReportParams>({
            query: ({ startDate, endDate, category }) => {
                const params = new URLSearchParams({
                    startDate,
                    endDate,
                    ...(category && { category }),
                });
                return `reports/timeline?${params}`;
            },
            providesTags: (_result, _error, { startDate, endDate, category }) => [
                { type: 'TimelineReport', id: `${startDate}-${endDate}-${category || 'all'}` },
                { type: 'TimelineReport', id: 'LIST' },
            ],
        }),
    }),
});

export const { useGetCategoryReportQuery, useGetTimelineReportQuery } = reportsApi;
