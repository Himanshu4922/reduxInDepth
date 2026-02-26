import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  productsError,
  setAllProducts,
  whileFetching,
} from "../store/slices/productSlice";

export default function Header() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(whileFetching());
    fetch("https://fakestoreapi.com/products")
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        // console.log(data);
        dispatch(setAllProducts(data));
      })
      .catch(() => {
        dispatch(productsError());
      });
  }, []);

  const cartItemsData = useSelector((allState) => allState.cartItems);
  let cartItemsCount = 0;
  cartItemsData.forEach(function (cartItem) {
    cartItemsCount += cartItem.qty;
  });
  return (
    <header className="bg-white shadow-md py-3 px-5 flex justify-between items-center">
      <Link to="/">
        <h1 className="text-xl font-semibold">Shop</h1>
      </Link>
      <nav>
        <ul className="flex items-center gap-2">
          <li>
            <Link to="/wishlist">
              <button className="cursor-pointer px-4 py-0.5 bg-blue-300 rounded-sm hover:bg-blue-400 transition-colors duration-200 font-medium relative">
                <span>Wishtlist</span>
              </button>
            </Link>
          </li>
          <li>
            <Link to="/cart">
              <button className="cursor-pointer px-4 py-0.5 bg-blue-300 rounded-sm hover:bg-blue-400 transition-colors duration-200 font-medium relative">
                <span>Cart</span>
                <span className="absolute w-6 h-6 rounded-full bg-white -top-2 -right-2 flex justify-center items-center border tex-xs">
                  {cartItemsCount}
                </span>
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
