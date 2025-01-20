// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

import {describe, it} from "mocha";
import {assert} from "chai";
import {
    createSymmetricSignatureKey,
    createAsymmetricSignatureKeyPair,
    signSignature,
    verifySignature,
} from "../../src/utils/signature.mjs";

describe("Signature", function() {
    describe("#createSymmetricSignatureKey()", function() {
        it("should create and import symmetric signature key", async function() {
            const key = await createSymmetricSignatureKey();
            assert.isNotNull(key);
        });
    });

    describe("#createAsymmetricSignatureKeyPair()", function() {
        it("should create asymmetric signature key pair", async function() {
            const keyPair = await createAsymmetricSignatureKeyPair();
            assert.isNotNull(keyPair);
            assert.isNotNull(keyPair.publicKey);
            assert.isNotNull(keyPair.privateKey);
        });
    });

    describe("#signSignature() and #verifySignature() with symmetric key", function() {
        it("should sign and verify content with symmetric key", async function() {
            const key = await createSymmetricSignatureKey();
            const content = "Hello, World!";
            const isSymmetric = true;
            const signature = await signSignature(isSymmetric, key, content);
            const isValid = await verifySignature(isSymmetric, key, content, signature);
            assert.isTrue(isValid);
        });
    });

    describe("#signSignature() and #verifySignature() with asymmetric key", function() {
        it("should sign and verify content with asymmetric key", async function() {
            const {publicKey, privateKey} = await createAsymmetricSignatureKeyPair();
            const content = "Hello, World!";
            const isSymmetric = false;
            const signature = await signSignature(isSymmetric, privateKey, content);
            const isValid = await verifySignature(isSymmetric, publicKey, content, signature);
            assert.isTrue(isValid);
        });
    });
});
