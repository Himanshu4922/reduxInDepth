export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg shadow-md">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
        <p className="text-blue-600 font-bold text-lg mt-2">${item.price}</p>
      </div>

      {/* Quantity and Actions */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 font-medium text-sm mb-2"
        >
          Remove
        </button>

        {/* Quantity Selector */}
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
          <button
            onClick={() =>
              onQuantityChange(item.id, Math.max(1, item.quantity - 1))
            }
            className="px-3 py-1 hover:bg-gray-200 transition"
          >
            −
          </button>
          <span className="px-4 py-1 font-semibold">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="px-3 py-1 hover:bg-gray-200 transition"
          >
            +
          </button>
        </div>

        {/* Subtotal */}
        <p className="text-gray-700 font-semibold mt-2">
          Subtotal: ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
