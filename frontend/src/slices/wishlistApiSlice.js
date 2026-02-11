import { apiSlice } from './apiSlice';

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    toggleWishlist: builder.mutation({
      query: (productId) => ({
        url: `/api/wishlist/${productId}`,
        method: 'PUT',
      }),
    }),
  }),
});

export const { useToggleWishlistMutation } = wishlistApiSlice;
