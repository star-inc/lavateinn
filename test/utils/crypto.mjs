// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

import {describe, it} from "mocha";
import {assert} from "chai";

import {
    timingSafeEqualString,
    randomCode,
    randomString,
    hash2hex,
    hmac2hex,
} from "../../src/utils/crypto.mjs";

describe("Crypto", function() {
    describe("#timingSafeEqualString()", function() {
        it("should return true for equal strings", function() {
            const str1 = "secureString";
            const str2 = "secureString";
            assert.isTrue(timingSafeEqualString(str1, str2));
        });

        it("should return false for different strings", function() {
            const str1 = "secureString";
            const str2 = "differentString";
            assert.isFalse(timingSafeEqualString(str1, str2));
        });
    });

    describe("#randomCode()", function() {
        it("should return a string of the specified length", function() {
            const length = 6;
            const code = randomCode(length);
            assert.isString(code);
            assert.lengthOf(code, length);
        });
    });

    describe("#randomString()", function() {
        it("should return a string of the specified length", function() {
            const length = 10;
            const randomStr = randomString(length);
            assert.isString(randomStr);
            assert.lengthOf(randomStr, length);
        });
    });

    describe("#hash2hex()", function() {
        it("should return a hash of the input string", function() {
            const data = "inputString";
            const hash = hash2hex(data);
            assert.isString(hash);
            assert.lengthOf(hash, 64); // sha3-256 hash length
        });
    });

    describe("#hmac2hex()", function() {
        it("should return a HMAC of the input string", function() {
            const data = "inputString";
            const secret = "secretKey";
            const hmac = hmac2hex(data, secret);
            assert.isString(hmac);
            assert.lengthOf(hmac, 64); // sha3-256 hash length
        });
    });
});
