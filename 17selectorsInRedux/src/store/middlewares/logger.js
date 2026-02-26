export function logger(state) {
  return function (next) {
    return function (action) {
      //   console.log(state, next, action);
      next(action);
    };
  };
}
