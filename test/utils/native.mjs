// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

import {describe, it} from "mocha";
import {assert} from "chai";

import {
    dateNowSecond,
    hasProp,
    camelToSnakeCase,
    snakeToCamelCase,
} from "../../src/utils/native.mjs";

describe("Native", function() {
    describe("#dateNowSecond()", function() {
        it("should return a number", function() {
            assert.isNumber(dateNowSecond());
        });
    });

    describe("#hasProp()", function() {
        it("should return true if the property exists", function() {
            const obj = {a: 1};
            assert.isTrue(hasProp(obj, "a"));
        });

        it("should return false if the property does not exist", function() {
            const obj = {a: 1};
            assert.isFalse(hasProp(obj, "b"));
        });
    });

    describe("#camelToSnakeCase()", function() {
        it("should convert camelCase to snake_case", function() {
            const camelCaseStr = "camelCaseString";
            const snakeCaseStr = "camel_case_string";
            assert.equal(
                camelToSnakeCase(camelCaseStr),
                snakeCaseStr,
            );
        });
    });

    describe("#snakeToCamelCase()", function() {
        it("should convert snake_case to camelCase", function() {
            const snakeCaseStr = "snake_case_string";
            const camelCaseStr = "snakeCaseString";
            assert.equal(
                snakeToCamelCase(snakeCaseStr),
                camelCaseStr,
            );
        });
    });
});
