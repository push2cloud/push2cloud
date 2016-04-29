
API
---

### `step(fn, [fromCtx], [toCtx])`

#### `fn`: (context, callback)

the function which is exectued in this step.
Example:

```js
step((ctx, cb) => console.log(ctx); cb(null, ctx));
```

#### `fromCtx`: {a} -> {b}

`fromCtx` gets the context and returns a part of the context for `fn`.

Example:

```js
step(stepFn, (ctx) => ctx.subPart);
```

#### `toCtx`: ({a}, {b}) -> {c}

`toCtx` gets the context and the result of `fn` and returns the new context.

Example:

```js
step(stepFn, null, (ctx, result) => {
  ctx.computedStuff = result;
  return ctx;
});
```

### `waterfall([steps], [callback])`

A waterfall runs `n` `steps` after each other and passes the context from step to step.
`waterfall` returns a `step` which takes a `context` and an optional `callback`.
It returns a promise.

Example:

```js
const w = waterfall([
  step1
, step2
]);

w(context).then(onSuccess);
```

### `set(key, value)`

A helper to set a value on to the context object.

Example:

```js

const w = waterfall([
  set('foo', 43)
, step2
]);

w(context).then(onSuccess);
```

### `map(step, fromCtx, [toCtx])`

`map` can be used to run a step for each item of an array.

Example:

```js
map(packageApp, 'apps'); // packages each app from the apps array in the context.
```

There is alse a `mapSeries` and a `mapLimit`.
`mapLimit` must be called with a limit first which returns a new function.
i.e. `mapLimit(4)(step, 'apps')`


### Helpers to pick from the context

#### `diff`
#### `intersection`
#### `combine`
