import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: "",
    isLogin: false,
    userInfo: {},
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const authSelect = ({ auth }) => auth;
export const { setToken, setIsLogin,setUserInfo } = authSlice.actions;

export default authSlice.reducer;
