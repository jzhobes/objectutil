# objectutil

A handy collection of methods related to manipulating objects.

### clone
Performs a deep copy of the provided input. Supported data types at the moment are: Object, Array, Date, string, number, boolean, and function.
```javascript
const {clone} = require('objectutil');

// Cloneable data types: Object, Array, string, number, boolean, and
// function.
clone([
    {name: 'John'},
    ['nested array'],
    'foobar',
    42,
    true,
    () => console.log('hello world')
]);
```

### filter
Similar to Array.filter, but for objects. The filter function will iterate through every key in the object.
```javascript
const {filter} = require('objectutil');

filter({key1: 'foo', key2: 'bar', key3: 'baz'}, (key) => key !== 'key2');
// => {key1: 'foo', key3: 'baz'}
```

### toArray
Converts an object to an array. The optional 2rd argument is a custom mapper function to return just a specific subset of each element.
```javascript
const {toArray} = require('objectutil');

const input = {
    'MA': {name: 'Massachusetts'},
    'ME': {name: 'Maine'},
    'NH': {name: 'New Hampshire'}
};

toArray(input)
// => [{name: 'Massachusetts'}, {name: 'Maine'}, {name: 'New Hampshire'}]

toArray(input, (state) => state.name)
// => ['Massachusetts', 'Maine', 'New Hampshire']
```

### toObject
Converts an array to an object. The 2nd argument is the key name to use. Defaults to a string index if not provided. Optional 3rd argument is a custom mapper function to return just a specific subset of the object.
```javascript
const {toObject} = require('objectutil');

const input = [
    {code: 'MA', name: 'Massachusetts'},
    {code: 'ME', name: 'Maine'},
    {code: 'NH', name: 'New Hampshire'}
];

toObject(input)
/**
{
    '0': {code: 'MA', name: 'Massachusetts'},
    '1': {code: 'ME', name: 'Maine'},
    '2': {code: 'NH', name: 'New Hampshire'}
}
**/

toObject(input, 'code')
/**
{
    MA: {code: 'MA', name: 'Massachusetts'},
    ME: {code: 'ME', name: 'Maine'},
    NH: {code: 'NH', name: 'New Hampshire'}
}
**/

toObject(input, 'code', (state) => state.name))
/**
{
    MA: 'Massachusetts',
    ME: 'Maine',
    NH: 'New Hampshire'
}
**/
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
