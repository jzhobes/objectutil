/* global afterEach, beforeEach, describe, expect, require, test */
const {clone, filter, getByString, updateOrInsertByAttribute} = require('./objectutil');

describe('#clone', () => {

    test('modifying a cloned array does not affect the original', () => {
        const original = ['1', {foo: 'bar'}, '3'];
        const cloned = clone(original);
        cloned[0] = '2';
        cloned[1].foo = 'baz';
        cloned.pop();

        expect(original).toEqual(['1', {foo: 'bar'}, '3']);
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

describe('#getByString', () => {

    test('look up and returns an object\'s nested attribute value by string', () => {
        expect(getByString({
            a: {
                b: {
                    c: {
                        d: 'value'
                    }
                }
            }
        }, 'a.b.c.d')).toEqual('value');
    });

    test('returns undefined if not found', () => {
        expect(getByString({
            a: {
                b: {
                    c: {
                        d: 'value'
                    }
                }
            }
        }, 'a.b.c.d.e')).toEqual(undefined);
    });
});

describe('#updateOrInsertByAttribute', () => {

    test('it adds the object to the end of the list when the item is not found', () => {
        const original = [{
            uuid: 0,
            label: 'foo'
        }];
        const item = {
            uuid: 1,
            label: 'bar'
        };
        expect(updateOrInsertByAttribute(original, item, 'uuid')).toEqual(original.concat([item]));
    });

    test('it updates the found item with merged attributes', () => {
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
        expect(updateOrInsertByAttribute(original, item, 'uuid')[1]).toEqual({
            uuid: 1,
            label: 'bar',
            value: false,
            date: '',
            attribute: ''
        });
    });
});
