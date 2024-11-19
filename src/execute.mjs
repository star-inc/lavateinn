// Import modules
import {
    getMust,
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
    const hostname = getMust("HTTP_HOSTNAME");
    const port = parseInt(getMust("HTTP_PORT"));

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
    const hostname = getMust("HTTPS_HOSTNAME");
    const port = parseInt(getMust("HTTPS_PORT"));

    const [key, cert] = await Promise.all([
        readFile(getMust("HTTPS_KEY_PATH")),
        readFile(getMust("HTTPS_CERT_PATH")),
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
 * Load init application handlers.
 * @module src/execute
 * @param {Function[]} initHandlers - The init signal handlers.
 * @returns {object} The application invoker.
 */
function loadInits(initHandlers) {
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
 * @param {Function[]} exitHandlers - The exit signal handlers.
 * @returns {object} The application invoker.
 */
function loadExits(exitHandlers) {
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
 * Prepare the application and automatically detect protocols.
 * @module src/execute
 * @returns {Promise<void[]>} A promise that resolves when prepared.
 */
async function execute() {
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
    return Promise.all(setupPromises);
}
