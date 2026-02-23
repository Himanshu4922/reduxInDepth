import { createStore, combineReducers } from "redux";
import productReducer from "./productReducer";
import { cartReducer } from "./cartReducer";
import { produce } from "immer";

const rootReducer = combineReducers({
  products: productReducer,
  cartItems: cartReducer,
});

const store = createStore(rootReducer, __REDUX_DEVTOOLS_EXTENSION__());
// produce example
// const users = [
//   {
//     name: "Himanshu",
//     age: 23,
//   },
//   {
//     name: "Tarun",
//     age: 26,
//   },
// ];
// console.log(
//   produce(users, (usersProxy) => {
//     usersProxy[1].age = 20;
//   }),
// );
export default store;
