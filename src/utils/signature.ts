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
 * @param length - The signature key length, default is 64.
 * @returns The signature key.
 */
export function createSymmetricSignatureKey(
    length = 64,
): Promise<webcrypto.CryptoKey> {
    return subtle.generateKey({
        name: "hmac", hash: "sha-256", length,
    }, true, ["sign", "verify"]);
}

/**
 * Create signature key pair (asymmetric).
 * @returns The signature key pair.
 */
export async function createAsymmetricSignatureKeyPair():
Promise<webcrypto.CryptoKeyPair> {
    return subtle.generateKey({
        name: "ed25519",
    }, true, ["sign", "verify"]) as unknown as Promise<webcrypto.CryptoKeyPair>;
}

/**
 * Import signature key.
 * @param isSymmetric - The signature key type.
 * @param secretBuffer - The signature secret.
 * @returns The signature secret.
 */
export function importSignatureKey(
    isSymmetric: boolean,
    secretBuffer: Buffer,
): Promise<webcrypto.CryptoKey> {
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
 * @param isSymmetric - The signature key type.
 * @param key - The signature key.
 * @param content - The content to sign.
 * @returns The signature.
 */
export async function signSignature(
    isSymmetric: boolean,
    key: webcrypto.CryptoKey,
    content: string,
): Promise<string> {
    const algorithm = isSymmetric ? "hmac" : "ed25519";
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const signature = await subtle.sign(algorithm, key, data);
    return Buffer.from(signature).toString("hex");
}

/**
 * Verify content with signature secret.
 * @param isSymmetric - The signature key type.
 * @param key - The signature key.
 * @param content - The content to verify.
 * @param signatureHex - The signature.
 * @returns true if the signature is valid.
 */
export async function verifySignature(
    isSymmetric: boolean,
    key: webcrypto.CryptoKey,
    content: string,
    signatureHex: string,
): Promise<boolean> {
    const algorithm = isSymmetric ? "hmac" : "ed25519";
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const signature = Buffer.from(signatureHex, "hex");
    return await subtle.verify(algorithm, key, signature, data);
}
