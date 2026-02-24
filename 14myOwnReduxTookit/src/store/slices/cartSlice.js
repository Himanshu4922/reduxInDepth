import { produce } from "immer";

const findItem = (state, action) =>
  state.findIndex((item) => item.id === action.payload.id);

function myCreateSlice(configObj) {
  const { name, initialState, reducers } = configObj;
  const actions = {};

  //action creators
  Object.keys(reducers).forEach((reducerFn) => {
    actions[reducerFn] = function (payload) {
      return { type: `${name}/${reducerFn}`, payload };
    };
  });

  // reducer function for each action type
  function reducer(state = initialState, action) {
    return produce(state, (proxyState) => {
      const caseReducer = reducers[action.type.split("/")[1]];

      if (caseReducer) {
        return caseReducer(proxyState, action);
      } else {
        return proxyState;
      }
    });
  }
  return { actions, reducer };
}

const mySlice = myCreateSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addCartItem(state, action) {
      const itemExists = findItem(state, action);
      if (itemExists > -1) {
        state[itemExists].qty += 1;
        return state;
      }
      action.payload.qty = 1;
      state.push(action.payload);
      return state;
    },
    removeCartItem(state, action) {
      const itemExists = findItem(state, action);
      if (state[itemExists].qty > 1) {
        state[itemExists].qty -= 1;
      } else {
        state.splice(itemExists, 1);
      }
      return state;
    },
  },
});

export default mySlice.reducer;
export const { addCartItem, removeCartItem } = mySlice.actions;
