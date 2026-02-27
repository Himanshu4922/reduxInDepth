import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import { configureStore } from "@reduxjs/toolkit";
import { logger } from "./middlewares/logger";
import { apiMiddleware } from "./middlewares/api";

const store = configureStore({
  reducer: {
    products: productReducer,
    cartItems: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMiddleware),
});

export default store;
