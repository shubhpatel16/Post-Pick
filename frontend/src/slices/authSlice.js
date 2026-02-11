import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    toggleWishlistLocal: (state, action) => {
      if (!state.userInfo) return;

      const productId = action.payload;

      if (!state.userInfo.wishlist) {
        state.userInfo.wishlist = [];
      }

      if (state.userInfo.wishlist.includes(productId)) {
        state.userInfo.wishlist = state.userInfo.wishlist.filter(
          (id) => id !== productId
        );
      } else {
        state.userInfo.wishlist.push(productId);
      }

      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },

    logout: (state, action) => {
      state.userInfo = null;
      // NOTE: here we need to also remove the cart from storage so the next
      // logged in user doesn't inherit the previous users cart and shipping
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout, toggleWishlistLocal } = authSlice.actions;
export default authSlice.reducer;
