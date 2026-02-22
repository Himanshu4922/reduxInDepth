const initialState = [];

export function addCartItem(product) {
  return { type: "cart/addItem", payload: product };
}
export function removeCartItem(product) {
  return { type: "cart/removeItem", payload: product };
}
export function cartReducer(state = initialState, action) {
  switch (action.type) {
    case "cart/addItem": {
      const itemExists = state.find((elem, i) => elem.id === action.payload.id);
      if (itemExists) {
        return state.map((elem) => {
          if (itemExists === elem) {
            elem["qty"] += 1;
          }
          return elem;
        });
      } else {
        const newItem = { ...action.payload, qty: 1 };
        return [...state, newItem];
      }
    }
    case "cart/removeItem": {
      const itemExists = state.find((elem, i) => elem.id === action.payload.id);
      if (itemExists.qty > 1) {
        return state.map((elem) => {
          if (itemExists === elem) {
            elem["qty"] -= 1;
          }
          return elem;
        });
      } else {
        return state.filter((cartItem) => cartItem.id !== action.payload.id);
      }
    }
    default: {
      return state;
    }
  }
}
