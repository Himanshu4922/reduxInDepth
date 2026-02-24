# Redux Middleware — Learning Notes

> **Middleware in Redux** sits between `dispatch` and the `reducer` — intercepting, transforming, or halting actions before they hit the reducer.

---

## Why Middleware?

Reducers are **pure functions** — they must be predictable, with no side effects.  
This means **no API calls inside reducers**. Ever.

So where do we handle async logic? That's exactly where **middleware** comes in.

```
dispatch(action) → [Middleware] → reducer(state, action) → new state
```

---

## How It Works

Middleware is a **curried function** — a function that returns a function that returns a function.

```js
const loggingMiddleware = store => next => action => {
  console.log('Action dispatched:', action);
  const result = next(action);
  console.log('New state:', store.getState());
  return result;
};
```

### Breaking it down:

| Parameter | What it is |
|-----------|-----------|
| `store`   | The Redux store — gives access to `getState`, `dispatch`, `subscribe` |
| `next`    | Passes the action forward to the next middleware (or reducer if last) |
| `action`  | The action currently being dispatched |

---

## The Key Concept

By default, middleware **intercepts and stops** the action.  
You must explicitly call `next(action)` to forward it to the reducer.

```js
const blockMiddleware = store => next => action => {
  if (action.type === 'BLOCKED_ACTION') {
    console.log('Action blocked!');
    return; // Action never reaches the reducer
  }
  return next(action); // Forward to reducer
};
```

---

## Registering Middleware

### Old Way (Legacy Redux)
```js
import { createStore, applyMiddleware } from 'redux';

const store = createStore(
  rootReducer,
  applyMiddleware(loggingMiddleware, thunkMiddleware)
);
```

### Modern Way (Redux Toolkit — Recommended)
```js
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    products: productReducer,
    cartItems: cartReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
```

#### What is `getDefaultMiddleware`?

RTK ships with built-in middleware out of the box — you don't start from zero.

| Default Middleware | What it does |
|--------------------|-------------|
| `redux-thunk`      | Allows dispatching functions (for async logic / API calls) |
| `serializabilityCheck` | Warns if non-serializable values (like functions/dates) are in state |
| `immutabilityCheck` | Warns if you accidentally mutate state |

By calling `getDefaultMiddleware().concat(logger)`, you **keep all the defaults** and **add your own on top**. If you just passed `[logger]` directly, you'd lose all the default middleware — which is almost never what you want.

```js
// Replaces ALL middleware (loses thunk, checks, etc.)
middleware: [logger]

// Keeps defaults + adds your own
middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
```

---

## Mental Model

```
User Event
    ↓
dispatch(action)
    ↓
┌─────────────────────┐
│    Middleware 1     │ ← logging, analytics
│    Middleware 2     │ ← async API calls
│    Middleware 3     │ ← error handling
└─────────────────────┘
    ↓
  reducer(state, action)
    ↓
  new state → UI updates
```

---

## Key Takeaways

- Reducers must be **pure** → no API calls, no side effects
- Middleware is the right place for **async logic and side effects**
- Middleware is a **curried function**: `store => next => action => {}`
- Call `next(action)` to **forward** the action, or don't to **block** it
- Multiple middlewares chain together via `applyMiddleware()`

---

*Learning Redux one concept at a time *