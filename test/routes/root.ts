// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

import "../../src/init/config.ts";

import {after, before, describe, it} from "mocha";
import {expect} from "chai";
import request from "supertest";
import {serve} from "@hono/node-server";
import type {AddressInfo} from "node:net";

import {resetApp, StatusCodes, useApp} from "../../src/init/hono.ts";
import mountRoute from "../../src/routes/root.ts";

describe("Root Routes", () => {
    let server: ReturnType<typeof serve>;
    let url: string;

    before(async () => {
        resetApp();
        mountRoute();
        const app = useApp();
        server = serve({
            fetch: app.fetch,
            port: 0,
        });
        await new Promise((resolve) => server.on("listening", resolve));
        const address = server.address() as AddressInfo;
        const port = address.port;
        url = `http://localhost:${port}`;
    });

    after(() => {
        if (server) {
            server.close();
        }
    });

    it("GET / should return the API index message", async () => {
        const res = await request(url).get("/");
        expect(res.status).to.equal(StatusCodes.IM_A_TEAPOT);
        expect(res.text).to.include("Star Inc. Lavateinn Framework");
    });

    it("GET /heart should return the instance ID", async () => {
        const res = await request(url).get("/heart");
        expect(res.status).to.equal(StatusCodes.OK);
        expect(res.text).to.be.a("string");
    });

    it("GET /robots.txt should return the robots.txt content", async () => {
        const res = await request(url).get("/robots.txt");
        expect(res.status).to.equal(StatusCodes.OK);
        expect(res.text).to.equal("User-agent: *\nDisallow: /");
    });
});
