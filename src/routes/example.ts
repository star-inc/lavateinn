// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Import modules
import {
    getInstanceMode,
    getNodeEnv,
    getRuntimeEnv,
} from "../config.ts";

import {Hono} from "hono";
import {validator} from "hono/validator";
import type {StatusCode} from "hono/utils/http-status";
import type {HonoEnv} from "../types/hono.ts";

import {StatusCodes, useApp} from "../init/hono.ts";
import {useQueue} from "../init/queue.ts";
import amqp from "amqplib";

import * as utilVisitor from "../utils/visitor.ts";
import {timingSafeEqualString} from "../utils/crypto.ts";
import {dateNowSecond} from "../utils/native.ts";

import useMiddlewareRestrictor from "../middleware/restrictor.ts";

// Create router
const router = new Hono<HonoEnv>();

/**
 * >openapi
 * /example/now:
 *   get:
 *     tags:
 *       - example
 *     summary: Get POSIX timestamp
 *     description: Example to show current POSIX timestamp.
 *     responses:
 *       200:
 *         description: Returns current POSIX timestamp.
 */
router.get("/now", (c) => {
    return c.json({timestamp: dateNowSecond()});
});

/**
 * >openapi
 * /example/visitor:
 *   get:
 *     tags:
 *       - example
 *     summary: Get current visitor information
 *     description: Example to show the visitor's IP and
 *                  User-Agent with utils/visitor.
 *     responses:
 *       200:
 *         description: Returns current visitor information.
 */
router.get("/visitor", (c) => {
    return c.json({
        ip_address: utilVisitor.getIPAddress(c),
        user_agent: utilVisitor.getUserAgent(c),
    });
});

/**
 * >openapi
 * /example/env:
 *   get:
 *     tags:
 *       - example
 *     summary: Get the application environment
 *     description: Example to return the application environment.
 *     responses:
 *       200:
 *         description: Returns the application environment.
 */
router.get("/env", (c) => {
    // Get environment variables
    const nodeEnv = getNodeEnv();
    const runtimeEnv = getRuntimeEnv();
    const instanceMode = getInstanceMode();

    // Send response
    return c.json({
        node_env: nodeEnv,
        runtime_env: runtimeEnv,
        instance_mode: instanceMode,
    });
});

/**
 * >openapi
 * /example/empty:
 *   get:
 *     tags:
 *       - example
 *     summary: Empty field checks
 *     description: Example to check fields with validator.
 *     parameters:
 *       - in: query
 *         name: empty
 *         schema:
 *           type: string
 *         required: false
 *         description: The "empty" field of query, please leave it empty.
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 *       400:
 *         description: Returns "Bad Request" if the "empty" field of
 *                      query is not real empty (not unset).
 */
router.get(
    "/empty",
    validator("query", (value, c) => {
        const empty = value["empty"];
        if (empty !== undefined && empty !== "") {
            c.status(StatusCodes.BAD_REQUEST as StatusCode);
            return c.json({error: "empty field must be empty"});
        }
        return {empty};
    }),
    (c) => {
        return c.html(
            "200 Success<br />" +
            "(Field \"empty\" in query should be empty, " +
            "or it will send error \"400 Bad Request\".)",
        );
    },
);

// Define the trusted code
const trustedCode = "qwertyuiop";

/**
 * >openapi
 * /example/guess/{code}:
 *   get:
 *     tags:
 *       - example
 *     summary: Test restrictor works
 *     description: Example to show how the restrictor works.
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: The passphrase, the true answer is "qwertyuiop".
 *     responses:
 *       200:
 *         description: Returns "Hello" if the answer is correct.
 *       403:
 *         description: Returns "Forbidden" if the answer is wrong.
 */
router.get(
    "/guess/:code",
    useMiddlewareRestrictor(5, 30, true),
    (c) => {
        const untrustedCode = c.req.param("code");
        if (!timingSafeEqualString(untrustedCode, trustedCode)) {
            c.status(StatusCodes.FORBIDDEN as StatusCode);
            return c.body(null);
        }
        return c.text(`Hello! ${trustedCode}`);
    },
);

// Subscribe to the queue
const queue = await useQueue();
queue.subscribe("example", (message: amqp.ConsumeMessage | null) => {
    if (message) {
        const code = message.content.toString();
        console.log(`Received: ${code}`);
    }
});

/**
 * >openapi
 * /example/queue/{content}:
 *   get:
 *     tags:
 *       - example
 *     summary: Test queue works
 *     description: Example to show how the queue works.
 *     parameters:
 *       - in: path
 *         name: content
 *         schema:
 *           type: string
 *         required: true
 *         description: The queue content.
 *     responses:
 *       201:
 *         description: Returns "Accepted" if the content is queued.
 */
router.get(
    "/queue/:content",
    async (c) => {
        const q = await useQueue();
        const queueContent = Buffer.from(c.req.param("content"));
        q.deliver("example", queueContent);
        c.status(StatusCodes.ACCEPTED as StatusCode);
        return c.body(null);
    },
);

// Export routes mapper (function)
export default (): void => {
    // Use application
    const app = useApp();

    // Mount the router
    app.route("/example", router);
};
