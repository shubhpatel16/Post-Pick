import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlistItems: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistLocal: (state, action) => {
      const productId = action.payload;

      const exists = state.wishlistItems.find(
        (item) => item === productId
      );

      if (exists) {
        state.wishlistItems = state.wishlistItems.filter(
          (id) => id !== productId
        );
      } else {
        state.wishlistItems.push(productId);
      }
    },
    setWishlist: (state, action) => {
      state.wishlistItems = action.payload;
    },
  },
});

export const { toggleWishlistLocal, setWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;