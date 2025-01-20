// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

import {describe, it} from "mocha";
import {expect} from "chai";
import request from "supertest";

import {useApp, StatusCodes} from "../src/init/express.mjs";

describe("Example Routes", () => {
    let app;

    before(function() {
        app = useApp();
    });

    it("GET /example/now should return current POSIX timestamp", async () => {
        const res = await request(app).get("/example/now");
        expect(res.status).to.equal(StatusCodes.OK);
        expect(res.body).to.have.property("timestamp");
    });

    it("GET /example/visitor should return visitor information", async () => {
        const res = await request(app).get("/example/visitor");
        expect(res.status).to.equal(StatusCodes.OK);
        expect(res.body).to.have.property("ip_address");
        expect(res.body).to.have.property("user_agent");
    });

    it("GET /example/env should return application environment", async () => {
        const res = await request(app).get("/example/env");
        expect(res.status).to.equal(StatusCodes.OK);
        expect(res.body).to.have.property("node_env");
        expect(res.body).to.have.property("runtime_env");
        expect(res.body).to.have.property("instance_mode");
    });

    it("GET /example/empty should return success if 'empty' field is empty", async () => {
        const res = await request(app).get("/example/empty");
        expect(res.status).to.equal(StatusCodes.OK);
        expect(res.text).to.include("200 Success");
    });

    it("GET /example/empty should return 400 if 'empty' field is not empty", async () => {
        const res = await request(app).get("/example/empty").query({empty: "not_empty"});
        expect(res.status).to.equal(StatusCodes.BAD_REQUEST);
    });

    it("GET /example/guess/:code should return 200 if code is correct", async () => {
        const res = await request(app).get("/example/guess/qwertyuiop");
        expect(res.status).to.equal(StatusCodes.OK);
        expect(res.text).to.include("Hello! qwertyuiop");
    });

    it("GET /example/guess/:code should return 403 if code is incorrect", async () => {
        const res = await request(app).get("/example/guess/wrongcode");
        expect(res.status).to.equal(StatusCodes.FORBIDDEN);
    });

    it("GET /example/queue/:content should return 201 if content is queued", async () => {
        const res = await request(app).get("/example/queue/testcontent");
        expect(res.status).to.equal(StatusCodes.ACCEPTED);
    });
});
