// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// The simple toolbox for Node.js

/**
 * Get POSIX Timestamp in seconds.
 * @module src/utils/native
 * @returns {number} The current timestamp in seconds.
 */
export function dateNowSecond() {
    return Math.floor(Date.now() / 1000);
}

/**
 * Shortcut for hasOwnProperty with safe.
 * @module src/utils/native
 * @param {object} srcObject - The source object.
 * @param {string} propName - The property name.
 * @returns {boolean} true if the property exists.
 */
export function hasProp(srcObject, propName) {
    return Object.hasOwn(srcObject, propName);
}

/**
 * Converts a string from camelCase to snake_case.
 * @module src/utils/native
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
 * @module src/utils/native
 * @param {string} str - The input string in snake_case format.
 * @returns {string} The transformed string in camelCase format.
 */
export function snakeToCamelCase(str) {
    return str.toLowerCase().replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace("-", "").replace("_", ""),
    );
}
