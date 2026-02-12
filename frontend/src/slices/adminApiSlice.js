import { apiSlice } from './apiSlice';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: ({ startDate, endDate }) => ({
        url: '/api/admin/dashboard',
        params: { startDate, endDate },
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetDashboardStatsQuery } = adminApiSlice;
