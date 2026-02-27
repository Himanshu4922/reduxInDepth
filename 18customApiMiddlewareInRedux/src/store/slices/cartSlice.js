import { createSlice } from "@reduxjs/toolkit";

const findItem = (state, action) =>
  state.findIndex((item) => item.id === action.payload.id);

const slice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addCartItem(state, action) {
      const itemExists = findItem(state, action);
      if (itemExists > -1) {
        state[itemExists].qty += 1;
      } else {
        // action.payload.qty = 1; //can't as rtk freezes action.payload in dev mode
        state.push({ ...action.payload, qty: 1 });
      }
    },
    removeCartItem(state, action) {
      const itemExists = findItem(state, action);
      if (state[itemExists].qty > 1) {
        state[itemExists].qty -= 1;
      } else {
        state.splice(itemExists, 1);
      }
    },
  },
});
export default slice.reducer;
export const { addCartItem, removeCartItem } = slice.actions;
