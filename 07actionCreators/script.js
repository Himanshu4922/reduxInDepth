import { combineReducers, createStore } from "redux";
import productReducer from "./productReducer";
import cartReducer from "./cartReducer";
import wishlistReducer from "./wishlistReducer";
import { products } from "./products";

const reducers = combineReducers({
  products: productReducer,
  cartItems: cartReducer,
  wishlistItems: wishlistReducer,
});
const store = createStore(reducers, __REDUX_DEVTOOLS_EXTENSION__());

// store.getState();

// add to cart
store.dispatch({
  type: "ADD_TO_CART",
  payload: products[0], // iPhone 15
});

// add another unit of same product
store.dispatch({
  type: "ADD_TO_CART",
  payload: products[0],
});

// decrease quantity
store.dispatch({
  type: "DECREASE_QTY",
  payload: 1, // product id
});

// remove product completely
store.dispatch({
  type: "REMOVE_FROM_CART",
  payload: 1, // product id
});

// clear cart
store.dispatch({
  type: "CLEAR_CART",
});

// add to wishlist
store.dispatch({
  type: "ADD_TO_WISHLIST",
  payload: products[2], // MacBook Air M2
});

// remove from wishlist
store.dispatch({
  type: "REMOVE_FROM_WISHLIST",
  payload: 3, // product id
});

// clear wishlist
store.dispatch({
  type: "CLEAR_WISHLIST",
});
