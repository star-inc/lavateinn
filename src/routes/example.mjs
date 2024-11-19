// Import modules
import {
    getNodeEnv,
    getRuntimeEnv,
    getInstanceMode,
} from "../config.mjs";
import {useApp, express, StatusCodes} from "../init/express.mjs";

import * as utilVisitor from "../utils/visitor.mjs";
import * as utilNative from "../utils/native.mjs";

import middlewareValidator from "express-validator";
import middlewareInspector from "../middleware/inspector.mjs";
import middlewareRestrictor from "../middleware/restrictor.mjs";

// Create router
const {Router: newRouter} = express;
const router = newRouter();

// Request body parser middleware
router.use(express.json());

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
router.get("/now", (_, res) => {
    res.send({timestamp: utilNative.dateNowSecond()});
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
router.get("/visitor", (req, res) => {
    res.send({
        ip_address: utilVisitor.getIPAddress(req),
        user_agent: utilVisitor.getUserAgent(req),
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
router.get("/env", (_, res) => {
    // Get environment variables
    const nodeEnv = getNodeEnv();
    const runtimeEnv = getRuntimeEnv();
    const instanceMode = getInstanceMode();

    // Send response
    res.send({
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
 *     description: Example to check fields with middlewareValidator.
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
router.get("/empty",
    middlewareValidator.query("empty").isEmpty(),
    middlewareInspector, (_, res) => {
        res.send(
            "200 Success<br />" +
            "(Field \"empty\" in query should be empty, " +
            "or it will send error \"400 Bad Request\".)",
        );
    },
);

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
const trustedCode = "qwertyuiop";
router.get("/guess/:code",
    middlewareRestrictor(5, 30, true),
    (req, res) => {
        const untrustedCode = req.params.code;
        if (untrustedCode !== trustedCode) {
            res.sendStatus(StatusCodes.FORBIDDEN);
            return;
        }
        res.send(`Hello! ${trustedCode}`);
    },
);

// Export routes mapper (function)
export default () => {
    // Use application
    const app = useApp();

    // Mount the router
    app.use("/example", router);
};
