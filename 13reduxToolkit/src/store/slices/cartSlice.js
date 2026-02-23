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
        return state;
      }
      action.payload.qty = 1;
      state.push(action.payload);
      return state;
    },
    removeCartItem(state, action) {
      const itemExists = findItem(state, action);
      if (state[itemExists].qty > 1) {
        state[itemExists].qty -= 1;
      } else {
        state.splice(itemExists, 1);
      }
      return state;
    },
  },
});
export default slice.reducer;
export const { addCartItem, removeCartItem } = slice.actions;
console.log(slice);
