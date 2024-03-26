// The simple toolbox for Node.js

/**
 * Get POSIX Timestamp (second)
 * @module native
 * @function
 * @return {number}
 */
export function getPosixTimestamp() {
    return Math.floor(new Date().getTime() / 1000);
}

/**
 * Shortcut for hasOwnProperty with safe.
 * @module native
 * @function
 * @param {object} srcObject
 * @param {string} propName
 * @return {boolean}
 */
export function isObjectPropExists(srcObject, propName) {
    return Object.hasOwn(srcObject, propName);
}
