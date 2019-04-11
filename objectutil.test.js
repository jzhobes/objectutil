/* global afterEach, beforeEach, describe, expect, require, test */
const {clone, filter, safeWrap, unwrap, updateOrAppend} = require('./objectutil');

describe('#clone', () => {

    test('modifying a cloned array does not affect the original', () => {
        const original = ['1', {foo: 'bar'}, '3'];
        original.foo = 'bar';

        const controlGroup = clone(original);

        const testGroup = clone(original);
        testGroup[0] = '2';
        testGroup[1].foo = 'baz';
        testGroup.pop();
        testGroup.foo = 'baz';

        expect(original).toEqual(controlGroup);
    });

    test('modifying a cloned object does not affect the original', () => {
        const original = {
            foo: 'bar',
            nested: {
                foo: 'bar'
            }
        };
        const cloned = clone(original);
        cloned.foo = 'baz';
        cloned.nested.foo = 'baz';

        expect(original).toEqual({
            foo: 'bar',
            nested: {
                foo: 'bar'
            }
        });
    });

    test('returns the cloned function', () => {
        const original = {
            foo: () => 'bar'
        };
        expect(original.foo()).toEqual('bar');
    });

    test('returns the cloned date', () => {
        const date = new Date();
        const original = {
            foo: date
        };
        expect(original.foo.getTime()).toEqual(date.getTime());
    });

    test('returns the input itself if type is string, number, boolean, undefined, or null', () => {
        ['foobar', 1, true, undefined, null].forEach(input => {
            expect(clone(input)).toEqual(input);
        });
    });
});

describe('#filter', () => {

    test('removes unwanted keys', () => {
        const original = {
            foo: 'bar',
            baz: 'qux',
            quux: 'quuz'
        };
        expect(filter(original, (key) => key !== 'baz')).toEqual({
            foo: 'bar',
            quux: 'quuz'
        });
    });
});

describe('#safeWrap', () => {

    test('modifying the original object does not impact the wrapped object', () => {
        const input = {
            foo: 'bar'
        };
        const unwrappedInput = unwrap(safeWrap(input));
        expect(unwrappedInput).toEqual(input);
        unwrappedInput.foo = 'baz';
        expect(input.foo).toEqual('bar');
    });

    test('unwrapped values are intact from the original object', () => {
        const input = {
            foo: 'bar',
            baz: {
                foo: 'bar',
                baz: false,
                quux: 42
            }
        };
        const wrappedInput = safeWrap(input);
        expect(unwrap(wrappedInput)).toEqual(input);
        expect(unwrap(wrappedInput.foo)).toEqual(input.foo);
        expect(unwrap(wrappedInput.baz.foo)).toEqual(input.baz.foo);
        expect(unwrap(wrappedInput.baz.baz)).toEqual(input.baz.baz);
        expect(unwrap(wrappedInput.baz.quux)).toEqual(input.baz.quux);
        expect(unwrap(wrappedInput.baz.quux.foo.bar)).toEqual(undefined);
    });
});

describe('#updateOrAppend', () => {

    test('it adds the object to the end of the array when the object is not found', () => {
        const original = [{
            uuid: 0,
            label: 'foo'
        }];
        const item = {
            uuid: 1,
            label: 'bar'
        };
        expect(updateOrAppend(original, item, 'uuid')).toEqual(original.concat([item]));
    });

    test('it updates the found item with thew new attributes', () => {
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
        expect(updateOrAppend(original, item, 'uuid')[1]).toEqual({
            uuid: 1,
            label: 'bar',
            value: false,
            date: '',
            attribute: ''
        });
    });
});
