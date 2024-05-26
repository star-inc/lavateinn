// The simple toolbox for Node.js

import {
    createHash,
    randomBytes,
} from "node:crypto";

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

/**
 * Converts a string from camelCase to snake_case.
 * @param {string} str The input string in camelCase format.
 * @return {string} The transformed string in snake_case format.
 */
export function camelToSnakeCase(str) {
    return str.replace(/[A-Z]/g, (letter) =>
        `_${letter.toLowerCase()}`,
    );
}

/**
 * Converts a camelCase string to snake_case.
 * @param {string} str The input string in snake_case format.
 * @return {string} The transformed string in camelCase format.
 */
export function snakeToCamelCase(str) {
    return str.toLowerCase().replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace("-", "").replace("_", ""),
    );
}

/**
 * Create cryptographic random string.
 * @param {number} length
 * @return {string}
 */
export function randomString(length) {
    const seed = randomBytes(length);
    return seed.toString("base64url").substring(0, length);
}

/**
 * Hash string into md5 hex.
 * @param {string} data
 * @return {string}
 */
export function md5hex(data) {
    return createHash("md5").
        update(data).
        digest("hex");
}
