// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// The cryptographic toolbox for Node.js

import {
    createHash,
    createHmac,
    randomInt,
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
    return randomInt(0, maxValue).
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
    return randomBytes(length).
        toString("base64url").
        substring(0, length);
}

/**
 * Hash string into hash hex.
 * @module src/utils/crypto
 * @param {string} data - The input data.
 * @param {string} [algo] - The algorithm to use, default is sha3-256.
 * @returns {string} The hash hex.
 */
export function hash2hex(data, algo="sha3-256") {
    return createHash(algo).update(data).digest("hex");
}

/**
 * Hash string into hash hex.
 * @module src/utils/crypto
 * @param {string} data - The input data.
 * @param {string} secret - The secret key.
 * @param {string} [algo] - The algorithm to use, default is sha3-256.
 * @returns {string} The hash hex.
 */
export function hmac2hex(data, secret, algo="sha3-256") {
    return createHmac(algo, secret).update(data).digest("hex");
}
