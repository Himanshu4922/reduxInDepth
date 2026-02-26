import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    loading: false,
    list: [],
    error: "",
  },
  reducers: {
    whileFetching(state, action) {
      state.loading = true;
    },
    setAllProducts(state, action) {
      state.error = "";
      state.loading = false;
      state.list = action.payload;
    },
    productsError(state, action) {
      state.loading = false;
      state.error = "Something went wrong!";
    },
  },
});

export default productSlice.reducer;

export const { setAllProducts, whileFetching, productsError } =
  productSlice.actions;

export const getAllProducts = (allState) => allState.products.list;
export const getProductsLoadingState = (allState) => allState.products.loading;
export const getProductsError = (allState) => allState.products.error;
