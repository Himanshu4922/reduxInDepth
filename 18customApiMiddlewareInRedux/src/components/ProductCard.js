import { useDispatch } from "react-redux";
import { addCartItem } from "../store/slices/cartSlice";

export default function ProductCard({ product }) {
  const { title, image } = product;
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden p-2 flex flex-col">
      {/* Image */}
      <div className="h-32 flex items-center justify-center">
        <img
          src={image}
          alt={`${title} image`}
          className="h-full w-full hover:scale-105 transition duration-200 object-contain"
          loading="lazy"
        />
      </div>

      {/* Title */}
      <h2 className="text-sm font-medium mt-2">{title}</h2>

      {/* Buttons */}
      <div className="flex justify-center gap-2 mt-auto">
        <button
          className="w-full px-2 py-1 bg-blue-400 rounded-md cursor-pointer hover:bg-blue-500 transition-colors duration-200"
          onClick={() => dispatch(addCartItem(product))}
        >
          Add to Cart
        </button>

        <button
          className="w-full px-2 py-1 bg-blue-400 rounded-md cursor-pointer hover:bg-blue-500 transition-colors duration-200"
          onClick={() => dispatch(addCartItem(product))}
        >
          Add to Wishlist
        </button>
      </div>
    </div>
  );
}
