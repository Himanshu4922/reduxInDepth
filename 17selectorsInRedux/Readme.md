# Selectors in Redux , What They Are, Why They Matter, and How to Use Them Right

Most people learn Redux and move on without really understanding selectors. They write their `useSelector` calls inline, get things working, and never think about it again, until performance becomes a problem or the codebase becomes impossible to maintain.

This is a breakdown of everything you need to know about selectors: what they are, why the naive approach breaks down, and how `createSelector` fixes it.

---

## The Basics

A selector is just a function that takes Redux state as input and returns some piece of it.

```js
const selectUser = (state) => state.user;
const selectCartItems = (state) => state.cart.items;
const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
```

You use them in components with `useSelector`:

```js
const user = useSelector(selectUser);
const items = useSelector(selectCartItems);
```

That's it. Nothing fancy. The point of writing them as separate named functions instead of inlining the logic is that now you have one place to change if your state shape changes, and you can reuse the same selector across multiple components.

But this is just the start. The real value of selectors shows up when you need derived data.

---

## The Problem with Derived Data

Say you want to show only the items in the cart that cost more than $100. You might write this:

```js
const expensiveItems = useSelector(
  (state) => state.cart.items.filter(item => item.price > 100)
);
```

This works, but it has a subtle problem that will bite you.

`useSelector` re renders the component every time its returned value changes. To check if the value changed, it uses strict reference equality `===`. Two things are only considered equal if they are literally the same object in memory.

`.filter()` always returns a new array. Every single time. Even if the results are identical.

So what happens? Any time any part of your Redux state changes , completely unrelated state, a different slice entirely c this selector runs, `.filter()` produces a brand new array, `useSelector` sees a new reference, and your component re-renders. For nothing.

On a small app this doesn't matter. On a real app with hundreds of components and frequent state updates, this causes serious performance problems.

---

## Memoization , The Fix

Memoization means caching the result of a function and returning the cached version when the inputs haven't changed.

Applied to selectors: if the state that your selector depends on hasn't changed, skip the computation and return the same result reference as last time. Same reference means `useSelector` sees no change, and your component does not re-render.

This is what `createSelector` from the Reselect library does. Redux Toolkit ships with it built in.

---

## How createSelector Works

```js
import { createSelector } from '@reduxjs/toolkit';

const selectCartItems = (state) => state.cart.items;
const selectMinPrice = (state) => state.filters.minPrice;

const selectExpensiveItems = createSelector(
  [selectCartItems, selectMinPrice],
  (items, minPrice) => items.filter(item => item.price > minPrice)
);
```

`createSelector` takes two things: an array of input selectors and a result function.

The input selectors run every time. They are cheap , they just read from state. Their results are compared to the previous call using `===`. If none of them changed, the result function is skipped and the previous result is returned as-is, same reference included.

If any input changed, the result function runs, the new value gets cached, and that becomes the new result.

```
First call:
  selectCartItems  → items_v1
  selectMinPrice   → 100
  inputs are new   → result fn runs → returns filtered_v1, caches it

Second call (unrelated state changed):
  selectCartItems  → items_v1  (same reference)
  selectMinPrice   → 100       (same value)
  inputs unchanged → result fn skipped → returns cached filtered_v1

Third call (items changed):
  selectCartItems  → items_v2  (new reference)
  inputs changed   → result fn runs → returns filtered_v2, caches it
```

Your component only re-renders in the third case , when the data it actually depends on changed.

---

## Composing Selectors

Memoized selectors can be used as inputs to other memoized selectors. This is where things get powerful.

```js
// Base selectors
const selectAllProducts = (state) => state.products.list;
const selectActiveCategory = (state) => state.filters.category;

// Level 2 , filters products
const selectFilteredProducts = createSelector(
  [selectAllProducts, selectActiveCategory],
  (products, category) => products.filter(p => p.category === category)
);

// Level 3 , counts filtered products
const selectFilteredCount = createSelector(
  [selectFilteredProducts],
  (filtered) => filtered.length
);

// Level 4 , checks if any exist
const selectHasFilteredProducts = createSelector(
  [selectFilteredCount],
  (count) => count > 0
);
```

Each level only recomputes when its specific inputs change. `selectFilteredCount` does not recompute when unrelated state changes. It only recomputes when `selectFilteredProducts` returns a new reference, which only happens when `selectAllProducts` or `selectActiveCategory` actually changes.

You end up with a clean dependency chain where computation cascades only when necessary.

---

## When You Actually Need createSelector

Not every selector needs to be memoized. Primitive values don't cause the reference equality problem.

```js
// Fine without memoization , returns a primitive
const selectUserName = (state) => state.user.name;
const selectItemCount = (state) => state.cart.items.length;
const selectIsAdmin = (state) => state.user.role === 'admin';

// Needs memoization , returns a new object/array every time
const selectUserSummary = (state) => ({
  name: state.user.name,
  email: state.user.email,
});

const selectActiveItems = (state) =>
  state.cart.items.filter(item => item.active);

const selectMergedData = (state) => ({
  ...state.orders,
  ...state.user.preferences,
});
```

The rule is straightforward: if your selector returns a primitive, you don't need `createSelector`. If it does any transformation , `.filter()`, `.map()`, object spread, combining fields , wrap it.

---

## Passing Arguments to Selectors

Sometimes you need a selector that takes a dynamic argument, like looking up an item by id. The standard approach is a selector factory , a function that takes the argument and returns a memoized selector.

```js
const makeSelectProductById = (id) =>
  createSelector(
    [(state) => state.products.list],
    (products) => products.find(p => p.id === id)
  );
```

In the component, you use `useMemo` to make sure you're not recreating the selector on every render:

```js
const selectProduct = useMemo(() => makeSelectProductById(productId), [productId]);
const product = useSelector(selectProduct);
```

The reason this matters: each call to `makeSelectProductById` creates its own memoization cache. If you have ten components each rendering a different product, each gets its own selector instance with its own cache. They don't interfere with each other.

If you skip the factory pattern and try to pass the id directly to a single shared selector, different components will constantly invalidate each other's cache.

---

## The Default Cache Size

One thing to know: `createSelector` by default keeps a cache of one result. It remembers only the last call.

```js
selectExpensiveItems(stateA); // computes, caches result for stateA
selectExpensiveItems(stateA); // cache hit
selectExpensiveItems(stateB); // computes, caches result for stateB (forgets stateA)
selectExpensiveItems(stateA); // cache miss, recomputes
```

In a typical React app this is fine because you're calling selectors with one state at a time. But if the same selector is shared across multiple components with different arguments , which is what happens if you skip the factory pattern , you'll get constant cache misses and recomputation.

---

## Structuring Selectors in a Real Codebase

A pattern that scales well is colocating selectors with their slice:

```js
// store/cartSlice.js
export const cartSlice = createSlice({ ... });

// Base selectors
export const selectCartItems = (state) => state.cart.items;
export const selectTaxRate = (state) => state.cart.taxRate;
export const selectDiscountCode = (state) => state.cart.discountCode;

// Derived selectors
export const selectSubtotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.price * item.qty, 0)
);

export const selectTotal = createSelector(
  [selectSubtotal, selectTaxRate],
  (subtotal, taxRate) => subtotal * (1 + taxRate)
);
```

Components import what they need. If the state shape changes, you update the base selectors in one place and everything downstream stays the same.

---

## The Mental Model

Think of `createSelector` as two layers. The first layer is cheap , it just reads from state. The second layer is expensive , it does the real computation. The first layer acts as a guard for the second.

```
state → [input selectors] → compare to cache → same? → return cached result
                                              → different? → run result fn → cache & return
```

Input selectors run every time. Result function runs only when inputs change.

That's the whole thing. Once you have this model in your head, knowing when to use `createSelector` becomes second nature. Anything that might return a new reference without the underlying data actually changing , wrap it.

---

## Quick Reference

- Selectors are functions that read from Redux state
- `useSelector` re-renders on reference inequality, not value inequality
- `.filter()`, `.map()`, and object spreads always return new references
- `createSelector` memoizes the result function, skipping it when inputs haven't changed
- Primitives don't need memoization
- New arrays and objects from transformations always need memoization
- Use selector factories for dynamic arguments (ids, filters, etc.)
- Compose selectors by using memoized selectors as inputs to other `createSelector` calls
- Default cache size is 1 , use factories when multiple instances need independent caches