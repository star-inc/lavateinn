// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

import "../../src/init/config.ts";

import {after, before, describe, it} from "mocha";
import {expect} from "chai";
import request from "supertest";
import {serve} from "@hono/node-server";
import type {AddressInfo} from "node:net";

import {resetApp, StatusCodes, useApp} from "../../src/init/hono.ts";
import mountRoute from "../../src/routes/example.ts";

describe("Example Routes", () => {
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

    it("GET /example/now should return current POSIX timestamp", async () => {
        const res = await request(url).get("/example/now");
        expect(res.status).to.equal(StatusCodes.OK);
        expect(res.body).to.have.property("timestamp");
    });

    it("GET /example/visitor should return visitor information", async () => {
        const res = await request(url).get("/example/visitor");
        expect(res.status).to.equal(StatusCodes.OK);
        expect(res.body).to.have.property("ip_address");
        expect(res.body).to.have.property("user_agent");
    });

    it("GET /example/env should return application environment", async () => {
        const res = await request(url).get("/example/env");
        expect(res.status).to.equal(StatusCodes.OK);
        expect(res.body).to.have.property("node_env");
        expect(res.body).to.have.property("runtime_env");
        expect(res.body).to.have.property("instance_mode");
    });

    it("GET /example/empty should return success if 'empty' field is empty", async () => {
        const res = await request(url).get("/example/empty");
        expect(res.status).to.equal(StatusCodes.OK);
        expect(res.text).to.include("200 Success");
    });

    it("GET /example/empty should return 400 if 'empty' field is not empty", async () => {
        const res = await request(url).get("/example/empty").query({empty: "not_empty"});
        expect(res.status).to.equal(StatusCodes.BAD_REQUEST);
    });

    it("GET /example/guess/:code should return 200 if code is correct", async () => {
        const res = await request(url).get("/example/guess/qwertyuiop");
        expect(res.status).to.equal(StatusCodes.OK);
        expect(res.text).to.include("Hello! qwertyuiop");
    });

    it("GET /example/guess/:code should return 403 if code is incorrect", async () => {
        const res = await request(url).get("/example/guess/wrongcode");
        expect(res.status).to.equal(StatusCodes.FORBIDDEN);
    });

    it("GET /example/queue/:content should return 201 if content is queued", async () => {
        const res = await request(url).get("/example/queue/testcontent");
        expect(res.status).to.equal(StatusCodes.ACCEPTED);
    });
});
