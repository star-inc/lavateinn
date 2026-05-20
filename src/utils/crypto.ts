// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// The cryptographic toolbox for Node.js

import {
    createHash,
    createHmac,
    randomBytes,
    randomInt,
    timingSafeEqual,
} from "node:crypto";

/**
 * Wrap the timingSafeEqual function for comparing string.
 * @param dataX - The data to compare.
 * @param dataY - The data to compare.
 * @returns true if the data is equal.
 */
export function timingSafeEqualString(dataX: string, dataY: string): boolean {
    const encoder = new TextEncoder();
    const encodedX = encoder.encode(dataX);
    const encodedY = encoder.encode(dataY);
    return encodedX.length === encodedY.length &&
        timingSafeEqual(encodedX, encodedY);
}

/**
 * Create cryptographic random code.
 * @param length - Length of code.
 * @returns The random code.
 */
export function randomCode(length: number): string {
    const maxValue = (10 ** length) - 1;
    return randomInt(0, maxValue).
        toString().
        padStart(length, "0");
}

/**
 * Create cryptographic random string.
 * @param length - Length of string.
 * @returns The random string.
 */
export function randomString(length: number): string {
    return randomBytes(length).
        toString("base64url").
        substring(0, length);
}

/**
 * Hash string into hash hex.
 * @param data - The input data.
 * @param algo - The algorithm to use, default is sha3-256.
 * @returns The hash hex.
 */
export function hash2hex(data: string, algo = "sha3-256"): string {
    return createHash(algo).update(data).digest("hex");
}

/**
 * Hash string into hash hex.
 * @param data - The input data.
 * @param secret - The secret key.
 * @param algo - The algorithm to use, default is sha3-256.
 * @returns The hash hex.
 */
export function hmac2hex(
    data: string,
    secret: string,
    algo = "sha3-256",
): string {
    return createHmac(algo, secret).update(data).digest("hex");
}
