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
 * Wraps an object to safely return any object property, ignoring any undefined errors. This is analogous to using the existential operator in TypeScript.
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
 * Clones the provided array of objects and attempts to update the old object with the updated object by the specified key. If key is not provided, defaults to 'id'.
 *
 * @private
 * @param {Array} items The array of items to clone from.
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
 * Clones the provided array of objects and attempts to update the old object with the updated object by the specified key. If key is not provided, defaults to 'id'.
 *
 * @param {Array} items The array of items to clone from.
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
 * @param {Array} items The list of items to clone from.
 * @param {Object} updatedOrNewItem The new item to update or add.
 * @param {string} [attribute] The attribute key to use. Defaults to 'id'.
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
    safeWrap,
    unwrap,
    updateIn,
    updateOrAppend
};
