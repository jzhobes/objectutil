/* global module */

/**
 * Performs a deep clone of an array.
 *
 * @private
 * @param {Array} input The input array to clone.
 * @returns {Array}
 */
const _cloneArray = (input) => {
    const output = [];
    Object.keys(input).forEach(key => {
        if (!isNaN(key)) {
            output.push(clone(input[key]));
        } else {
            output[key] = clone(input[key]);
        }
    });
    return output;
};

/**
 * Performs a deep clone of an object.
 *
 * @private
 * @param {Object} input The input object to clone.
 * @returns {Object}
 */
const _cloneObject = (input) => {
    if (input instanceof Date) {
        return new Date(input.getTime());
    } else {
        const output = {};
        Object.keys(input).forEach(key => {
            output[key] = clone(input[key]);
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
 * @param {Object} input The input object.
 * @param {function} filterFunction The filter function.
 */
const filter = (input, filterFunction) => {
    return Object.keys(input).filter(filterFunction).reduce((filteredMap, key) => {
        filteredMap[key] = input[key];
        return filteredMap;
    }, {});
};

/**
 * Looks up and returns an object's nested attribute value by string (e.g. getByString({a: {b: {c: {d: 'value'}}}}, 'a.b.c.d') will return the string 'value').
 *
 * @param {Object} object The object to check.
 * @param {string} namedString The dot-notation named string.
 * @returns {*}
 */
const getByString = (object, namedString) => {
    return namedString.split('.').reduce((o, i) => o[i], object);
};

/**
 * Takes the provided input, checks its type, and returns an empty version of it.
 *
 * @param {*} input The input to check.
 * @returns {*}
 */
const createEmptyInstance = (input) => {
    const dataType = Array.isArray(input) ? 'array' : typeof input;
    let emptyData;
    if (dataType === 'array') {
        emptyData = [];
    } else if (dataType === 'object') {
        emptyData = {};
    } else if (dataType === 'string') {
        emptyData = '';
    } else {
        emptyData = undefined;
    }
    return emptyData;
};

/**
 * Clones the provided list of items and attempts to update the old item with the updated item by the specified attribute. If not found, then the item will be appended to the cloned array.
 *
 * @param {Array} items The list of items to clone from.
 * @param {Object} updatedOrNewItem The new item to update or add.
 * @param {string} [attribute] The attribute key to use. Defaults to 'id'.
 * @returns {Array}
 */
const updateOrInsertByAttribute = (items, updatedOrNewItem, attribute = 'id') => {
    const clonedArray = clone(items || []);
    if (updatedOrNewItem) {
        const isUpdate = clonedArray.some((item, i) => {
            if (updatedOrNewItem && updatedOrNewItem[attribute] === item[attribute]) {
                clonedArray[i] = {
                    ...clonedArray[i],
                    ...updatedOrNewItem
                };
                return true;
            }
            return false;
        });
        // If nothing was updated, then append to the cloned array.
        if (!isUpdate) {
            clonedArray.push(updatedOrNewItem);
        }
    }
    return clonedArray;
};

/**
 * Clones the provided list of items and attempts to update the old item with the updated item by id. If not found, then the item will be appended to the cloned array.
 *
 * @param {Array} items The list of items to clone from.
 * @param {Object} updatedOrNewItem The new item to update or add.
 * @returns {Array}
 */
const updateOrInsertById = (items, updatedOrNewItem) => {
    return updateOrInsertByAttribute(items, updatedOrNewItem, 'id');
};

module.exports = {
    clone,
    createEmptyInstance,
    filter,
    getByString,
    updateOrInsertByAttribute,
    updateOrInsertById
};
