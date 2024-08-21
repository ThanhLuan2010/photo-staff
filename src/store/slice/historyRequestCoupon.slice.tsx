import { createSlice } from "@reduxjs/toolkit";

export const historySlice = createSlice({
  name: "history",
  initialState: {
    dataRequestCp:[]
  },
  reducers: {
    setDataRequestCp: (state, action) => {
      state.dataRequestCp = action.payload
    },
    
  },
});

export const historySelect = ({ history }) => history;
export const { setDataRequestCp,} = historySlice.actions;

export default historySlice.reducer;
