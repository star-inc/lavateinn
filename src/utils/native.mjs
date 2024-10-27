// The simple toolbox for Node.js

import {
    createHash,
    createHmac,
    randomBytes,
} from "node:crypto";

/**
 * Get POSIX Timestamp in seconds.
 * @module native
 * @function
 * @return {number}
 */
export function dateNowSecond() {
    return Math.floor(Date.now() / 1000);
}

/**
 * Shortcut for hasOwnProperty with safe.
 * @module native
 * @function
 * @param {object} srcObject
 * @param {string} propName
 * @return {boolean}
 */
export function hasProp(srcObject, propName) {
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
 * Create cryptographic random code.
 * @param {number} length length of code
 * @return {string}
 */
export function randomCode(length) {
    const maxValue = (10 ** length) - 1;
    return crypto.
        randomInt(0, maxValue).
        toString().
        padStart(length, "0");
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
 * Hash string into hash hex.
 * @param {string} data - The input data.
 * @param {string} [algo] - The algorithm to use.
 * @return {string}
 */
export function hash5hex(data, algo="md5") {
    return createHash(algo).update(data).digest("hex");
}

/**
 * Hash string into hash hex.
 * @param {string} data - The input data.
 * @param {string} [algo=md5] - The algorithm to use.
 * @return {string}
 */
export function hmac5hex(data, algo="md5") {
    return createHmac(algo).update(data).digest("hex");
}
