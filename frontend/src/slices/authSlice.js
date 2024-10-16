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
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
    updateUserRole: (state, action) => {
      if (state.userInfo) {
        state.userInfo.role = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      }
    },
  },
});

export const { setCredentials, logout, updateUserRole } = authSlice.actions;

export default authSlice.reducer;


export const selectUserRole = (state) => state.auth.userInfo?.role;
