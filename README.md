# objectutil

A handy collection of methods related to manipulating objects.

### clone
Performs a deep copy of the provided input. Supported data types at the moment are: Object, Array, Date, string, number, boolean, and function.
```javascript
const {clone} = require('objectutil');

// Cloneable data types: Object, Array, string, number, boolean, and function.
clone([{name: 'John'}, {name: 'Jane'}, {name: 'Bob'}, 'foobar', 42, () => console.log('hello world')]);
```

### filter
Similar to Array.filter, but for objects. The filter function will iterate through every key in the object.
```javascript
const {filter} = require('objectutil');

filter({key1: 'foo', key2: 'bar', key3: 'baz'}, (key) => key !== 'key2');
// => {key1: 'foo', key3: 'baz'}
```

### safeWrap / unwrap
Wraps an object to safely return any object property, ignoring any undefined errors. This is analogous to using the existential operator in TypeScript.
```javascript
const {safeWrap, unwrap} = require('objectutil');

const input = {a: {b: {c: {d: 'value'}}}};
const wrappedInput = safeWrap(input);
unwrap(wrappedInput.a.b.c.d.e.f.g.h)
// => undefined
unwrap(wrappedInput.a.b.c.d)
// => 'value'

```

### updateIn
Clones the provided array of objects and attempts to update the old object with the updated object by the specified key. If key is not provided, defaults to 'id'.
```javascript
const {updateIn} = require('objectutil');

const original = [{
    uuid: 0,
    label: 'foo'
    }, {
    uuid: 1,
    label: 'quz',
    value: true,
    date: ''
}];
const item = {
    uuid: 1,
    label: 'bar',
    value: false,
    attribute: ''
};
updateIn(original, item, 'uuid');
/** =>
{
    uuid: 1,
    label: 'bar',
    value: false,
    date: '',
    attribute: ''
});
*/
```

### updateOrAppend
Same as updateIn, but if the object to update is not in the array, it will be appended to the cloned array.
