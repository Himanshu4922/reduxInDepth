import { useDispatch } from "react-redux";
import { setAllProducts, whileFetching } from "../slices/productSlice";

const BASE_URL = "https://fakestoreapi.com/";

export function apiMiddleware(store) {
  const { dispatch } = store;
  return function (next) {
    return function (action) {
      if (action.type === "api/makeCall") {
        next(action);
        const { urlEndPoint, onSuccess, onError, onLoading } = action.payload;
        console.log(`Fetching from ${BASE_URL}${urlEndPoint}`);
        dispatch({ type: onLoading, payload: "" });
        fetch(`${BASE_URL}${urlEndPoint}`)
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            dispatch({ type: onSuccess, payload: data });
          })
          .catch(() => {
            dispatch({ type: onError, payload: "" });
          });
      } else {
        return next(action);
      }
    };
  };
}
