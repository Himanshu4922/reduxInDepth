import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import { configureStore } from "@reduxjs/toolkit";
import { logger } from "./middlewares/logger";

const store = configureStore({
  reducer: {
    products: productReducer,
    cartItems: cartReducer,
  },
});

export default store;
