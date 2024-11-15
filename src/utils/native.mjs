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
 * @returns {number} The current timestamp in seconds.
 */
export function dateNowSecond() {
    return Math.floor(Date.now() / 1000);
}

/**
 * Shortcut for hasOwnProperty with safe.
 * @module native
 * @function
 * @param {object} srcObject - The source object.
 * @param {string} propName - The property name.
 * @returns {boolean} true if the property exists.
 */
export function hasProp(srcObject, propName) {
    return Object.hasOwn(srcObject, propName);
}

/**
 * Converts a string from camelCase to snake_case.
 * @module native
 * @function
 * @param {string} str - The input string in camelCase format.
 * @returns {string} The transformed string in snake_case format.
 */
export function camelToSnakeCase(str) {
    return str.replace(/[A-Z]/g, (letter) =>
        `_${letter.toLowerCase()}`,
    );
}

/**
 * Converts a camelCase string to snake_case.
 * @module native
 * @function
 * @param {string} str - The input string in snake_case format.
 * @returns {string} The transformed string in camelCase format.
 */
export function snakeToCamelCase(str) {
    return str.toLowerCase().replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace("-", "").replace("_", ""),
    );
}

/**
 * Create cryptographic random code.
 * @module native
 * @function
 * @param {number} length - Length of code.
 * @returns {string} The random code.
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
 * @module native
 * @function
 * @param {number} length - Length of string.
 * @returns {string} The random string.
 */
export function randomString(length) {
    const seed = randomBytes(length);
    return seed.toString("base64url").substring(0, length);
}

/**
 * Hash string into hash hex.
 * @module native
 * @function
 * @param {string} data - The input data.
 * @param {string} [algo] - The algorithm to use.
 * @returns {string} The hash hex.
 */
export function hash2hex(data, algo="md5") {
    return createHash(algo).update(data).digest("hex");
}

/**
 * Hash string into hash hex.
 * @module native
 * @function
 * @param {string} data - The input data.
 * @param {string} [algo] - The algorithm to use.
 * @returns {string} The hash hex.
 */
export function hmac2hex(data, algo="md5") {
    return createHmac(algo).update(data).digest("hex");
}
