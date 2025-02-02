// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

import {describe, it} from "mocha";
import {assert} from "chai";

import {
    getIPAddress,
    getUserAgent,
} from "../../src/utils/visitor.mjs";

describe("Visitor", function() {
    describe("#getIPAddress()", function() {
        it("should return 127.0.0.1 in non-production", function() {
            const req = {ip: "192.168.1.1"};
            const ipAddress = getIPAddress(req);
            assert.equal(ipAddress, "127.0.0.1");
        });
    });

    describe("#getUserAgent()", function() {
        it("should return the User-Agent", function() {
            const req = {header: () => "Mozilla/5.0"};
            const userAgent = getUserAgent(req);
            assert.equal(userAgent, "Mozilla/5.0");
        });

        it("should return 'Unknown' if User-Agent is not present", function() {
            const req = {header: () => null};
            const userAgent = getUserAgent(req);
            assert.equal(userAgent, "Unknown");
        });
    });
});
