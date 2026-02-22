import { useDispatch } from "../react-redux";
import { addCartItem } from "../store/cartReducer";

export default function ProductCard({ product }) {
  const { title, thumbnail, id } = product;
  const dispatch = useDispatch();
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden p-2 space-y-2">
      <div className="h-32">
        <img
          src={thumbnail}
          alt={`${title} image`}
          className="h-full w-full hover:scale-105 transiton duration-200 object-contain"
          loading="lazy"
        />
      </div>
      <h2>{title}</h2>
      <div className="flex justify-center gap-2">
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
          Add to Wishtlist
        </button>
      </div>
    </div>
  );
}
