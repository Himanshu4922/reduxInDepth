import { createContext, useContext, useEffect, useRef, useState } from "react";

export const StoreContext = createContext();

// Provider only passes the store REFERENCE — not the state
// This component will NEVER re-render on dispatch
export function MyProvider({ store, children }) {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export function useDispatch() {
  const store = useContext(StoreContext);
  return store.dispatch;
}

export function useSelector(selectorFn, equalityFn = (a, b) => a === b) {
  const store = useContext(StoreContext);

  // store the last selected value in a ref
  // ref update does NOT cause re-render
  const selectedStateRef = useRef(selectorFn(store.getState()));

  const [, forceRender] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newSelectedState = selectorFn(store.getState());

      // only re-render if the selected value actually changed
      if (!equalityFn(newSelectedState, selectedStateRef.current)) {
        selectedStateRef.current = newSelectedState;
        forceRender((n) => n + 1);
      }
    });

    return unsubscribe;
  }, [store]);

  return selectedStateRef.current;
}
