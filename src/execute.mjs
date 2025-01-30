// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Import modules
import {
    get,
    getSplited,
} from "./config.mjs";

import process from "node:process";
import http from "node:http";
import https from "node:https";

import {
    readFile,
} from "node:fs/promises";

import {
    useApp,
} from "./init/express.mjs";

import {
    instanceRole,
    setupClusterPrimary,
    setupClusterWorker,
} from "./init/instance.mjs";

import {
    camelToSnakeCase,
} from "./utils/native.mjs";

/**
 * Setup protocol - http
 * @module src/execute
 * @param {object} app - The application.
 * @returns {Promise<object>} The setup status.
 */
function setupHttpProtocol(app) {
    const protocol = "http";
    const hostname = get("HTTP_HOSTNAME");
    const port = parseInt(get("HTTP_PORT"));

    const httpServer = http.createServer({}, app);
    httpServer.listen(port, hostname);

    return {protocol, hostname, port};
}

/**
 * Setup protocol - https
 * @module src/execute
 * @param {object} app - The application.
 * @returns {Promise<object>} The setup status.
 */
async function setupHttpsProtocol(app) {
    const protocol = "https";
    const hostname = get("HTTPS_HOSTNAME");
    const port = parseInt(get("HTTPS_PORT"));

    const [key, cert] = await Promise.all([
        readFile(get("HTTPS_KEY_PATH")),
        readFile(get("HTTPS_CERT_PATH")),
    ]);

    const httpsServer = https.createServer({key, cert}, app);
    httpsServer.listen(port, hostname);

    return {protocol, hostname, port};
}

/**
 * Defines an application invoker.
 * @module src/execute
 * @returns {object} The application invoker.
 */
export function invokeApp() {
    return {
        loadRoutes,
        loadInits,
        loadExits,
        execute,
    };
}

/**
 * Load routes from specified router names.
 * @module src/execute
 * @param {string[]} routerNames - The names of the routers to load.
 * @returns {object} The application invoker.
 */
function loadRoutes(routerNames) {
    routerNames = routerNames.map(camelToSnakeCase);

    const routeDirectory = new URL("routes/", import.meta.url);
    const routeFilenames = routerNames.map(
        (n) => new URL(`${n}.mjs`, routeDirectory),
    );

    const routerMappers = routeFilenames.map((n) => import(n));
    routerMappers.forEach((c) => c.then((f) => f.default()));

    // Return application invoker
    return invokeApp();
}

// Define initial promises
const initPromises = [];

/**
 * @callback VoidCallback
 * @returns {Promise<void>|void}
 */

/**
 * Load init application handlers.
 * @module src/execute
 * @param {VoidCallback[]} initHandlers - The init signal handlers.
 * @returns {object} The application invoker.
 */
function loadInits(initHandlers) {
    // Primary instance won't setup any init handlers
    if (instanceRole === "primary") {
        // Return application invoker
        return invokeApp();
    }

    // Handle init signals
    const promises = initHandlers.map((f) => f());

    // Push the initial handlers onto the preparing promises
    initPromises.push(...promises);

    // Return application invoker
    return invokeApp();
}

/**
 * Load exit signal handlers.
 * @module src/execute
 * @param {VoidCallback[]} exitHandlers - The exit signal handlers.
 * @returns {object} The application invoker.
 */
function loadExits(exitHandlers) {
    // Primary instance won't setup any exit handlers
    if (instanceRole === "primary") {
        // Return application invoker
        return invokeApp();
    }

    // Handle exit signals
    const exitHandler = async () => {
        const promises = exitHandlers.map((f) => f());
        // Wait for all exit handlers resolved
        await Promise.all(promises);
        // Send exit signal
        process.exit(0);
    };

    // Define exit signals
    const exitSignals = [
        "SIGINT",
        "SIGTERM",
        "SIGQUIT",
    ];

    // Attach exit handlers
    exitSignals.forEach((signal) => {
        process.on(signal, exitHandler);
    });

    // Return application invoker
    return invokeApp();
}

/**
 * Prepare the application and detect protocols automatically.
 * @module src/execute
 * @returns {Promise<object[]>} A promise that resolves
 * when prepared protocols, empty array returned if
 * in cluster mode and primary instance.
 */
async function execute() {
    // Setup cluster
    if (instanceRole === "primary") {
        setupClusterPrimary();
        return []; // The primary instance won't setup any protocol
    }
    if (instanceRole === "worker") {
        await setupClusterWorker();
    }

    // Use application
    const app = useApp();

    // Wait for all init promises resolved
    await Promise.all(initPromises);

    // Get enabled protocols
    const enabledProtocols = getSplited("ENABLED_PROTOCOLS");

    // Define setup promises
    const setupPromises = [];

    // Setup HTTP
    if (enabledProtocols.includes("http")) {
        setupPromises.push(
            setupHttpProtocol(app),
        );
    }

    // Setup HTTPS
    if (enabledProtocols.includes("https")) {
        setupPromises.push(
            setupHttpsProtocol(app),
        );
    }

    // Return setup promises
    return setupPromises;
}
