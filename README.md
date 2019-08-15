# accessed

Accessed is a simple module that allows you to track property access of a given
object to ensure that only the data that is used (or not used) is included when
you `JSON.stringify` the data.

### Install

The module is published in the public npm registry and can be installed by
running:

```
npm install --save accessed
```

### Usage

```js
const accessed = require('accessed');

const data = accessed({
  foo: 'bar',
  bar: 'wat',
  key: 'value'
});

console.log(data.foo);
console.log(JSON.stringify(data)); // {"foo":"bar"}

console.log(data.bar);
console.log(JSON.stringify(data)); // {"foo":"bar", "bar": "wat"}
```

The module exposes the `accessed` function as default export. The function
accepts 2 arguments.

- `data` The object that needs to be tracked.
- `options` Additional configuration
  - `keys` An array of keys that should be included, even when they are not
    accessed by the code.
  - `exclude` Instead of returning an object on `JSON.stringify` that represents
    the keys that were accessed, return the data that was **not** accesed.

```js
const data = accessed({ foo: 'bar', hello: 'world' }, {
  keys: ['hello']
});

console.log(JSON.stringify(data)); // {"hello":"world"}
```

### License

[MIT](LICENSE)
