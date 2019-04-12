/* global module */

/**
 * Performs a deep clone of an array.
 *
 * @private
 * @param {Array} array The input array to clone.
 * @returns {Array}
 */
const _cloneArray = (array) => {
    const output = [];
    Object.keys(array).forEach(key => {
        // Clone the standard indexed elements.
        if (!isNaN(key)) {
            output.push(clone(array[key]));
        }
        // Clone any properties added to the array.
        else {
            output[key] = clone(array[key]);
        }
    });
    return output;
};

/**
 * Performs a deep clone of an object.
 *
 * @private
 * @param {Object} object The input object to clone.
 * @returns {Object}
 */
const _cloneObject = (object) => {
    if (object instanceof Date) {
        return new Date(object.getTime());
    } else {
        const output = {};
        Object.keys(object).forEach(key => {
            output[key] = clone(object[key]);
        });
        return output;
    }
};

/**
 * Performs a deep clone of an array or object.
 *
 * @param {*} input The input to clone.
 * @returns {Array|Object}
 */
const clone = (input) => {
    const inputType = typeof input;
    if (Array.isArray(input)) {
        return _cloneArray(input);
    } else if (!!input && inputType === 'object') {
        return _cloneObject(input);
    } else if (inputType === 'string' || inputType === 'number' || inputType === 'boolean' || input === undefined || input === null) {
        return input;
    } else if (inputType === 'function') {
        return input.bind(this);
    } else {
        console.error(`Unhandled input type of '${inputType}.`);
        return input;
    }
};

/**
 * Similar to Array.filter, but for objects. The filter function will iterate through every key in the object.
 *
 * @param {Object} object The input object.
 * @param {function} filterFunction The filter function.
 */
const filter = (object, filterFunction) => {
    return Object.keys(object).filter(filterFunction).reduce((filteredMap, key) => {
        filteredMap[key] = object[key];
        return filteredMap;
    }, {});
};

/**
 * Converts an object to an array. The optional 2rd argument is a custom mapper function to return just a specific
 * subset of each element.
 *
 * @param {Object} object The object to convert.
 * @param {function} [mapper] Optional mapper function to execute on each value in the object to map specific
 * elements. Syntax: `mapper(currentKey[, i]`.
 * @returns {Object}
 */
const toArray = (object, mapper) => {
    const isObject = typeof object === 'object' && object !== null;
    if (!isObject) {
        throw new Error('Method argument is not an object.');
    }
    return Object.keys(object).map((key, i) => mapper ? mapper(object[key], i) : object[key]);
};

/**
 * Converts an array to an object. The 2nd argument is the key name to use. Defaults to a string index if not
 * provided. Optional 3rd argument is a custom mapper function to return just a specific subset of the object.
 *
 * @param {Array} array The array to iterate through.
 * @param {string} [key] The name to use as the object key. Defaults to a string index if not provided.
 * @param {function} [mapper] Optional mapper function to execute on each object in the array to map specific
 * elements. Syntax: `mapper(currentValue[, i]`.
 * @returns {Object}
 */
const toObject = (array, key, mapper) => {
    if (!Array.isArray(array)) {
        throw new Error('Method argument is not an array.');
    }
    return array.reduce((accumulator, currentValue, i) => {
        accumulator[key ? String(currentValue[key]) : String(i)] = mapper ? mapper(currentValue, i) : currentValue;
        return accumulator;
    }, {});
};

// Inaccessible wrap key to unwrap with.
const wrapKey = Symbol();

/**
 * The underlying safe wrap implementation.
 *
 * @param {Object} input The object to wrap.
 * @returns {*}
 */
const _safeWrap = (input) => {
    // Just return the input if it's already wrapped.
    if (input && input[wrapKey]) {
        return input;
    }
    // Wrap non-object values to further allow proxying.
    const isObject = typeof input === 'object' && input !== null;
    if (!isObject) {
        input = {
            [wrapKey]: {
                value: input
            }
        };
    }

    return new Proxy(input, {
        get: (target, key) => {
            if (key === wrapKey) {
                if (target[wrapKey]) {
                    return target[wrapKey].value;
                }
                return target;
            }
            return safeWrap(target[key]);
        }
    });
};

/**
 * Wraps an object to safely return any object property, ignoring any undefined errors. This is analogous to using
 * the existential operator in TypeScript.
 *
 * @param {Object} input The object to wrap.
 * @returns {*}
 */
const safeWrap = (input) => {
    return _safeWrap(clone(input));
};

/**
 * Unwraps a safeWrapped object.
 *
 * @param {Object} wrappedInput The wrapped input object.
 * @returns {*}
 */
const unwrap = (wrappedInput) => {
    return wrappedInput[wrapKey];
};

/**
 * Clones the provided array of objects and attempts to update the old object with the updated object by the
 * specified key. If key is not provided, defaults to 'id'.
 *
 * @private
 * @param {Array} array The array of items to clone from.
 * @param {Object} updatedObject The updated object to mix in.
 * @param {string} [key] The object key to target with. Defaults to 'id'.
 * @returns {Object}
 */
const _updateIn = (array, updatedObject, key = 'id') => {
    const clonedArray = clone(array || []);
    const results = {
        updated: false,
        array: clonedArray
    };
    if (updatedObject) {
        results.updated = clonedArray.some((object, i) => {
            if (updatedObject[key] === object[key]) {
                clonedArray[i] = {
                    ...clonedArray[i],
                    ...clone(updatedObject)
                };
                return true;
            }
            return false;
        });
    }
    return results;
};

/**
 * Clones the provided array of objects and attempts to update the old object with the updated object by the
 * specified key. If key is not provided, defaults to 'id'.
 *
 * @param {Array} array The array of items to clone from.
 * @param {Object} updatedObject The updated object to mix in.
 * @param {string} [key] The object key to target with. Defaults to 'id'.
 * @returns {Array}
 */
const updateIn = (array, updatedObject, key = 'id') => {
    return _updateIn(array, updatedObject, key).array;
};

/**
 * Same as updateIn, but if the object to update is not in the array, it will be appended to the cloned array.
 *
 * @param {Array} array The list of items to clone from.
 * @param {Object} updatedObject The new item to update or add.
 * @param {string} [key] The attribute key to use. Defaults to 'id'.
 * @returns {Array}
 */
const updateOrAppend = (array, updatedObject, key = 'id') => {
    const results = _updateIn(array, updatedObject, key);
    // If nothing was updated, then append to the cloned array.
    if (!results.updated && updatedObject) {
        results.array.push(clone(updatedObject));
    }
    return results.array;
};

module.exports = {
    clone,
    filter,
    toArray,
    toObject,
    safeWrap,
    unwrap,
    updateIn,
    updateOrAppend
};
