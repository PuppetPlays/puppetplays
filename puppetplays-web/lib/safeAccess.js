import get from 'lodash/get';

/**
 * Safely access a nested property in an object without causing null pointer exceptions
 * @param {Object} obj - The object to access
 * @param {string|Array} path - The path to the property
 * @param {*} defaultValue - The value to return if the property doesn't exist
 * @returns {*} The value at the path or the default value
 */
export const safeGet = (obj, path, defaultValue = undefined) => {
  return get(obj, path, defaultValue);
};

/**
 * Safely access an array and make sure it's always an array
 * @param {Array|*} value - The value to ensure is an array
 * @returns {Array} The value as an array or an empty array
 */
export const safeArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === null || value === undefined) {
    return [];
  }
  return [value];
};

/**
 * Safely access an object and make sure it's always an object
 * @param {Object|*} value - The value to ensure is an object
 * @returns {Object} The value as an object or an empty object
 */
export const safeObject = (value) => {
  if (value === null || value === undefined) {
    return {};
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value;
  }
  return {};
};

/**
 * Safely access a string and make sure it's always a string
 * @param {string|*} value - The value to ensure is a string
 * @returns {string} The value as a string or an empty string
 */
export const safeString = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

/**
 * Safely access a number and make sure it's always a number
 * @param {number|*} value - The value to ensure is a number
 * @param {number} defaultValue - The default value if not a number
 * @returns {number} The value as a number or the default value
 */
export const safeNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}; 