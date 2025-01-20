// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Signature is used for signing and verifying data.

// It can be symmetric or asymmetric.
// Symmetric signature is used for HMAC-SHA256.
// Asymmetric signature is used for Ed25519.

// The toolbox is written with Web Crypto API.
// It can be used in both Node.js and browser.
// In other words, it is isomorphic for web development.

// Import modules
import {
    subtle,
    webcrypto,
} from "node:crypto";

/**
 * Create signature key (symmetric).
 * @module src/utils/signature
 * @param {number} [length] - The signature key length, default is 64.
 * @returns {Promise<webcrypto.CryptoKey>} The signature key.
 */
export function createSymmetricSignatureKey(length = 64) {
    return subtle.generateKey({
        name: "hmac", hash: "sha-256", length,
    }, true, ["sign", "verify"]);
}

/**
 * Create signature key pair (asymmetric).
 * @module src/utils/signature
 * @returns {Promise<webcrypto.CryptoKeyPair>} The signature key pair.
 */
export async function createAsymmetricSignatureKeyPair() {
    return subtle.generateKey({
        name: "ed25519",
    }, true, ["sign", "verify"]);
}

/**
 * Import signature key.
 * @module src/utils/signature
 * @param {boolean} isSymmetric - The signature key type.
 * @param {Buffer} secretBuffer - The signature secret.
 * @returns {Promise<webcrypto.CryptoKey>} The signature secret.
 */
export function importSignatureKey(isSymmetric, secretBuffer) {
    const algorithm = isSymmetric ? {
        name: "hmac",
        hash: {
            name: "sha-256",
        },
    } : {
        name: "ed25519",
    };
    return subtle.importKey(
        "raw", secretBuffer, algorithm, false,
        ["sign", "verify"],
    );
}

/**
 * Sign content with signature secret.
 * @module src/utils/signature
 * @param {boolean} isSymmetric - The signature key type.
 * @param {webcrypto.CryptoKey} key - The signature key.
 * @param {string} content - The content to sign.
 * @returns {Promise<string>} The signature.
 */
export async function signSignature(isSymmetric, key, content) {
    const algorithm = isSymmetric ? "hmac" : "ed25519";
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const signature = await subtle.sign(algorithm, key, data);
    return Buffer.from(signature).toString("hex");
}

/**
 * Verify content with signature secret.
 * @module src/utils/signature
 * @param {boolean} isSymmetric - The signature key type.
 * @param {webcrypto.CryptoKey} key - The signature key.
 * @param {string} content - The content to verify.
 * @param {string} signature - The signature.
 * @returns {Promise<boolean>} true if the signature is valid.
 */
export async function verifySignature(isSymmetric, key, content, signature) {
    const algorithm = isSymmetric ? "hmac" : "ed25519";
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    signature = Buffer.from(signature, "hex");
    return await subtle.verify(algorithm, key, signature, data);
}
