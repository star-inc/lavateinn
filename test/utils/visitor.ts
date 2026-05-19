// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

import {describe, it} from "mocha";
import {expect} from "chai";
import {getIPAddress, getUserAgent} from "../../src/utils/visitor.ts";

describe("Visitor", () => {
    describe("#getIPAddress()", () => {
        it("should return 127.0.0.1 in non-production", () => {
            const mockContext = {} as unknown as Parameters<
                typeof getIPAddress
            >[0];
            expect(getIPAddress(mockContext)).to.equal("127.0.0.1");
        });
    });

    describe("#getUserAgent()", () => {
        it("should return the User-Agent", () => {
            const mockContext = {
                req: {
                    header: (name: string): string | undefined => {
                        return name === "user-agent" ? "Test-Agent" : undefined;
                    },
                },
            } as unknown as Parameters<typeof getUserAgent>[0];
            expect(getUserAgent(mockContext)).to.equal("Test-Agent");
        });

        it("should return 'Unknown' if User-Agent is not present", () => {
            const mockContext = {
                req: {
                    header: (): string | undefined => {
                        return undefined;
                    },
                },
            } as unknown as Parameters<typeof getUserAgent>[0];
            expect(getUserAgent(mockContext)).to.equal("Unknown");
        });
    });
});
