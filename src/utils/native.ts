// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// The simple toolbox for Node.js

/**
 * Get POSIX Timestamp in seconds.
 * @returns The current timestamp in seconds.
 */
export function dateNowSecond() {
    return Math.floor(Date.now() / 1000);
}

/**
 * Shortcut for hasOwnProperty with safety.
 * @param srcObject - The source object.
 * @param propName - The property name.
 * @returns true if the property exists.
 */
export function hasProp(srcObject: object, propName: string): boolean {
    return Object.hasOwn(srcObject, propName);
}

/**
 * Converts a string from camelCase to snake_case.
 * @param str - The input string in camelCase format.
 * @returns The transformed string in snake_case format.
 */
export function camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) =>
        `_${letter.toLowerCase()}`,
    );
}

/**
 * Converts a camelCase string to snake_case.
 * @param str - The input string in snake_case format.
 * @returns The transformed string in camelCase format.
 */
export function snakeToCamelCase(str: string): string {
    return str.toLowerCase().replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace("-", "").replace("_", ""),
    );
}
