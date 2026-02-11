import { apiSlice } from './apiSlice';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: '/api/admin/dashboard',
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetDashboardStatsQuery } = adminApiSlice;
