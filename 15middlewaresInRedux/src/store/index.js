import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import { configureStore } from "@reduxjs/toolkit";
import { logger } from "./middlewares/logger";

const store = configureStore({
  reducer: {
    products: productReducer,
    cartItems: cartReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
