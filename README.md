# objectutil

A handy collection of methods related to manipulating objects.

### clone
Performs a deep copy of the provided input.
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

### getByString
Looks up and returns an object's nested attribute value by string.
```javascript
const {getByString} = require('objectutil');

getByString({a: {b: {c: {d: 'value'}}}}, 'a.b.c.d')
// => 'value'
```

### updateOrInsertByAttribute
Clones the provided list of items and attempts to update the old item with the updated item by the specified attribute. If not found, then the item will be appended to the cloned array.
```javascript
const {getByString} = require('objectutil');

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
updateOrInsertByAttribute(original, item, 'uuid');
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

