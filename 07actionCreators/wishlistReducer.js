const initialState = [];

export default function wishlistReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_TO_WISHLIST": {
      const product = action.payload;
      const exists = state.find((item) => item.id === product.id);

      if (exists) return state;

      return [...state, product];
    }

    case "REMOVE_FROM_WISHLIST":
      return state.filter((item) => item.id !== action.payload);

    case "CLEAR_WISHLIST":
      return [];

    default:
      return state;
  }
}
