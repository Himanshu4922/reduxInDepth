import { useDispatch, useSelector } from "react-redux";
import { addCartItem, removeCartItem } from "../store/slices/cartSlice";

function Cart() {
  const cartItems = useSelector((state) => state.cartItems);
  const dispatch = useDispatch();
  console.log("rendering");
  return (
    <div className="">
      <table className="w-full">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="py-4"></th>
            <th className="py-4">Product</th>
            <th className="py-4">Price</th>
            <th className="py-4">Qantity</th>
            <th className="py-4">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(({ title, thumbnail, price, qty }, i, cartItemArr) => (
            <tr key={title} className="border-b border-gray-200">
              <td className="py-4">
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-16 h-16 object-contain mx-auto"
                />
              </td>

              <td className="text-center">{title}</td>

              <td className="text-center font-medium">${price}</td>

              <td className="text-center">
                <div className="inline-flex border border-gray-400 rounded">
                  <button
                    className="px-3 border-r"
                    onClick={() => dispatch(removeCartItem(cartItemArr[i]))}
                  >
                    -
                  </button>
                  <span className="px-3">{qty}</span>
                  <button
                    className="px-3 border-l"
                    onClick={() => dispatch(addCartItem(cartItemArr[i]))}
                  >
                    +
                  </button>
                </div>
              </td>

              <td className="text-center font-semibold">
                ${(price * qty).toFixed(2)}
              </td>
            </tr>
          ))}
          <tr className="border-b border-gray-200">
            <td className="py-4 text-center" colSpan={4}>
              Total
            </td>
            <td className="py-4 text-center">
              $
              {cartItems
                .reduce(
                  (acc, currElem) => (acc += currElem.qty * currElem.price),
                  0,
                )
                .toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Cart;
