# How createSelector Actually Works

This is not about when to use it or best practices. This is about what actually happens when you write `createSelector(...)` and then call it. What runs, in what order, and why it behaves the way it does.

---

## Step One: Calling createSelector Does Not Compute Anything

When you write this:

```js
const selectExpensiveItems = createSelector(
  [(state) => state.cart.items],
  (items) => items.filter(item => item.price > 100)
);
```

Nothing runs. No filtering. No state reading. Nothing.

`createSelector` takes your input selectors and your result function, bundles them up, and returns a brand new function that memoizes the result of that result function, the one you pass after the input selector array(the second argument of the createSelector function). That returned function is `selectExpensiveItems`. It just sits there in memory waiting to be called.

The computation happens later, when you actually call `selectExpensiveItems(state)`.

---

## Step Two: What Happens the First Time You Call It

Let's say `useSelector` calls your selector for the first time:

```js
selectExpensiveItems(currentState)
```

Here is what runs, in order:

**1. Every input selector runs**

```js
// Your input selectors run one by one
const items    = selectCartItems(state);   // returns state.cart.items
const minPrice = selectMinPrice(state);    // returns state.filters.minPrice
```

Input selectors always run on every call. They are supposed to be cheap, just reading values off state.

**2. The cache is checked**

createSelector compares the current input results against what it cached from the last call using strict equality (`===`).

On the very first call, the cache is empty. There is nothing to compare against. So it moves on.

**3. The result function runs**

Since there is no cached result, it runs your result function with the input selector outputs as arguments:

```js
(items, minPrice) => items.filter(item => item.price > minPrice)
```

**4. The result gets cached**

createSelector saves two things: the inputs it just used, and the result it just computed.

**5. The result is returned**

---

## Step Three: What Happens on the Next Call

Now something in your app updates. Say the auth state changed, or a completely unrelated slice updated. `useSelector` fires again and calls your selector with the new state.

**1. Input selectors run again**

```js
const items    = selectCartItems(newState);
const minPrice = selectMinPrice(newState);
```

They always run. Every time.

**2. Cache comparison happens**

createSelector takes the fresh input results and compares them against what it stored last time:

```
items === cachedItems        (yes, cart did not change, same reference)
minPrice === cachedMinPrice  (yes, still 100)
```

Both match. Inputs have not changed.

**3. The result function is skipped**

This is the whole point. If inputs match, the result function never runs.

**4. The cached result is returned**

The exact same reference that was returned last time comes back. Same object in memory.

**5. useSelector sees no change**

`useSelector` compares the previous result and the current result using `===`. They are literally the same reference, so they are equal. No re-render.

---

## Step Four: What Happens When an Input Actually Changes

Now say the user adds something to the cart. `state.cart.items` gets a new array. `useSelector` calls your selector again.

**1. Input selectors run**

```js
const items    = selectCartItems(newState);   // returns a NEW array reference
const minPrice = selectMinPrice(newState);    // still 100
```

**2. Cache comparison happens**

```
items === cachedItems  (no, cart updated, items is a new array)
```

One mismatch is enough. createSelector moves on.

**3. The result function runs**

```js
items.filter(item => item.price > minPrice)
```

New computation, new filtered array.

**4. Cache updates**

The new inputs and new result replace whatever was cached before.

**5. New result is returned**

`useSelector` sees a different reference, so it triggers a re-render. Which is correct, because the data actually changed.

---

## The Cache Size

createSelector keeps a cache of exactly one result by default. It only remembers the most recent call.

```js
selectExpensiveItems(stateA); // computes, caches result for stateA
selectExpensiveItems(stateA); // cache hit, returns cached result
selectExpensiveItems(stateB); // computes, caches result for stateB, forgets stateA
selectExpensiveItems(stateA); // cache miss, has to compute again
```

In a normal React app this is fine because a component calls its selector with one state at a time. The problem shows up when the same selector instance is used by multiple components with different arguments, because they keep overwriting each other's cache. That is a separate problem solved by the factory pattern, but the root cause is this single-entry cache.

---

## What the Internals Look Like

createSelector is not magic. Simplified, it works like this:

```js
function createSelector(inputSelectors, resultFn) {
  let lastInputs = null;
  let lastResult = null;

  return function(state) {
    // Step 1: run all input selectors
    const currentInputs = inputSelectors.map(sel => sel(state));

    // Step 2: compare with previous inputs
    const inputsChanged = lastInputs === null ||
      currentInputs.some((input, i) => input !== lastInputs[i]);

    // Step 3: if nothing changed, return cached result
    if (!inputsChanged) {
      return lastResult;
    }

    // Step 4: inputs changed, run result function
    lastResult = resultFn(...currentInputs);
    lastInputs = currentInputs;

    return lastResult;
  };
}
```

That is the core of it. Two variables sitting in closure: `lastInputs` and `lastResult`. Input selectors run on every call. The result function runs only when inputs changed. The cached result comes back otherwise.

---

## Why Input Selectors Always Run

A common question is: if memoization skips computation, why do the input selectors run every time?

Because createSelector has no way to know if inputs changed without actually running them. It has to get the current values to compare against the cache. The assumption is that input selectors are cheap, just reading from state, so running them every time costs almost nothing. The thing being protected is the result function, which is the expensive part.

If you put heavy computation inside an input selector, you are doing it wrong. Input selectors should just read, result functions should compute.

```js
// Wrong, heavy work in input selector
createSelector(
  [(state) => state.items.filter(...)],  // this runs every single time
  (filtered) => filtered.length
);

// Correct, reading in input selector, computing in result function
createSelector(
  [(state) => state.items],             // just reads, cheap
  (items) => items.filter(...).length   // runs only when items change
);
```

---

## The Execution Flow, Summarized

```
Every time useSelector fires:

  state
    |
    v
  input selectors run (always)
    |
    v
  compare results to cache
    |
    +-- same? --> return cached result --> no re-render
    |
    +-- different? --> run result function --> cache new result --> return --> re-render
```

Input selectors run every time. Result function runs only when inputs change. Cached result means same reference. Same reference means no re-render.

That is the complete picture.