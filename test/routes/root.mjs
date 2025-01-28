// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

import "../../src/init/config.mjs";

import {describe, it} from "mocha";
import {expect} from "chai";
import request from "supertest";

import {useApp, StatusCodes} from "../../src/init/express.mjs";
import mountRoute from "../../src/routes/root.mjs";

describe("Root Routes", () => {
    let app;

    before(function() {
        mountRoute();
        app = useApp();
    });

    it("GET / should return the API index message", async () => {
        const res = await request(app).get("/");
        expect(res.status).to.equal(StatusCodes.IM_A_TEAPOT);
        expect(res.text).to.include("Star Inc. Lavateinn Framework");
    });

    it("GET /heart should return the instance ID", async () => {
        const res = await request(app).get("/heart");
        expect(res.status).to.equal(StatusCodes.OK);
        expect(res.text).to.be.a("string");
    });

    it("GET /robots.txt should return the robots.txt content", async () => {
        const res = await request(app).get("/robots.txt");
        expect(res.status).to.equal(StatusCodes.OK);
        expect(res.text).to.equal("User-agent: *\nDisallow: /");
    });
});
