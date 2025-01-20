// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// The cryptographic toolbox for Node.js

import {
    createHash,
    createHmac,
    randomBytes,
    timingSafeEqual,
} from "node:crypto";

/**
 * Wrap the timingSafeEqual function for comparing string.
 * @module src/utils/crypto
 * @param {string} dataX - The data to compare.
 * @param {string} dataY - The data to compare.
 * @returns {boolean} true if the data is equal.
 */
export function timingSafeEqualString(dataX, dataY) {
    const encoder = new TextEncoder();
    const encodedX = encoder.encode(dataX);
    const encodedY = encoder.encode(dataY);
    return encodedX.length === encodedY.length &&
        timingSafeEqual(encodedX, encodedY);
}

/**
 * Create cryptographic random code.
 * @module src/utils/crypto
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
 * @module src/utils/crypto
 * @param {number} length - Length of string.
 * @returns {string} The random string.
 */
export function randomString(length) {
    const seed = randomBytes(length);
    return seed.toString("base64url").substring(0, length);
}

/**
 * Hash string into hash hex.
 * @module src/utils/crypto
 * @param {string} data - The input data.
 * @param {string} [algo] - The algorithm to use.
 * @returns {string} The hash hex.
 */
export function hash2hex(data, algo="md5") {
    return createHash(algo).update(data).digest("hex");
}

/**
 * Hash string into hash hex.
 * @module src/utils/crypto
 * @param {string} data - The input data.
 * @param {string} [algo] - The algorithm to use.
 * @returns {string} The hash hex.
 */
export function hmac2hex(data, algo="md5") {
    return createHmac(algo).update(data).digest("hex");
}
