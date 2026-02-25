# Redux Toolkit & Immer: What You Can and Cannot Mutate

One of the most common beginner mistakes in Redux Toolkit and the error that comes with it is confusing enough that even experienced devs get tripped up.

```
Uncaught TypeError: Cannot add property qty, object is not extensible
```

If you've seen this, this guide is for you.

---

## A Little Background

Redux Toolkit uses **Immer** under the hood. Immer lets you write code that *looks* like you're directly mutating state, but behind the scenes it tracks your changes and produces a brand new immutable state object.

This is why you can do things like `state.push(item)` or `state[i].qty += 1` inside a reducer without breaking Redux's immutability rules.

But here's the thing most people miss:

> **Immer only wraps `state` in a draft proxy — nothing else.**

---

## How It Works Internally

When RTK runs your reducer, it does roughly this:

```js
const nextState = produce(currentState, (draft) => {
  yourReducer(draft, action); // only draft (state) is proxied by Immer
});
```

`action.payload` is never passed through `produce()`. It's just a plain JavaScript object. And in **development mode**, RTK calls `Object.freeze()` on it to help catch accidental mutations early.

`Object.freeze()` makes an object **non-extensible** — you cannot add new properties or change existing ones. That's exactly where the TypeError comes from.

---

## The 3 Things You Might Try to Mutate

### 1. `state` — Always safe

Anything that lives inside `state` is wrapped in an Immer draft proxy. Mutate it however you want.

```js
addCartItem(state, action) {
  state[0].qty += 1;        // fine
  state.push(someItem);     // fine
  state.splice(0, 1);       // fine
  state[2].name = "hello";  // fine
}
```

Immer tracks all of these and produces the correct new state.

---

### 2. `action.payload` — Never mutate directly

This is the one that causes the error.

```js
addCartItem(state, action) {
  action.payload.qty = 1; // TypeError: Cannot add property qty, object is not extensible
}
```

RTK froze this object. You cannot add new properties or modify existing ones.

**The fix** — spread `action.payload` into a new object first:

```js
addCartItem(state, action) {
  // spreading creates a brand new, unfrozen object
  state.push({ ...action.payload, qty: 1 });
}
```

This works because `{ ...action.payload }` creates a **new plain object** that Immer has no issue pushing into the draft state.

---

### 3. Variables outside the reducer — Never do this

```js
const someExternalObj = { name: "Himanshu" };

addCartItem(state, action) {
  someExternalObj.name = "hemu"; // won't throw an error, but it's wrong
  state.push({ ...action.payload, qty: 1 });
}
```

JavaScript won't stop you — it won't crash. But mutating external variables inside a reducer **breaks the pure function rule** that Redux is built on.

Reducers must be **pure functions**:
- Same inputs → same output, always
- No side effects (no touching anything outside the function's scope)

If you mutate external state in a reducer:
- Redux DevTools time-travel breaks
- Hot reloading behaves unexpectedly
- Tests become unreliable and flaky

---

## A Real Example — Before and After

A cart reducer with all three scenarios:

**Wrong way:**

```js
const externalObj = { name: "Himanshu" };

addCartItem(state, action) {
  const index = state.findIndex(item => item.id === action.payload.id);

  if (index > -1) {
    state[index].qty += 1;      // this part is fine
  } else {
    action.payload.qty = 1;     // TypeError — payload is frozen
    externalObj.name = "hemu";  // side effect — don't do this
    state.push(action.payload); // pushing a frozen object into state
  }
}
```

**Correct way:**

```js
addCartItem(state, action) {
  const index = state.findIndex(item => item.id === action.payload.id);

  if (index > -1) {
    state[index].qty += 1;                      // mutating draft state
  } else {
    state.push({ ...action.payload, qty: 1 });  // new object, safe to push
  }
}
```

---

## Quick Reference

| What you're mutating | Safe? | Reason |
|---|---|---|
| `state.anyProp` | Yes | Immer draft proxy |
| `state[i].anyProp` | Yes | Immer draft proxy (nested) |
| `state.push(...)` | Yes | Array methods work on draft |
| `state.splice(...)` | Yes | Array methods work on draft |
| `action.payload.anyProp` |  No | Frozen by RTK via `Object.freeze()` |
| `action.payload.newProp = x` | No | Object is non-extensible |
| `{ ...action.payload }` then use it | Yes | Spread creates a new unfrozen object |
| External variables | No | Side effect, breaks reducer purity |

---

## The Golden Rule

```
Immer only proxies state.
Everything else is your responsibility.

Mutate state freely
Spread action.payload before pushing it into state
Never mutate payload directly
Never touch variables outside the reducer
```

Once this mental model clicks, RTK becomes extremely intuitive to work with.