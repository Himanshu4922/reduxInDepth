import { createStore, combineReducers } from "redux";
import productReducer from "./productReducer";
import { cartReducer } from "./cartReducer";

const rootReducer = combineReducers({
  products: productReducer,
  cartItems: cartReducer,
});

const store = createStore(rootReducer, __REDUX_DEVTOOLS_EXTENSION__());

export default store;
