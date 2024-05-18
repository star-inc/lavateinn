// Import modules
import {
    getMust,
    getSplited,
} from "./config.mjs";

import http from "node:http";
import https from "node:https";

import {
    readFile,
} from "node:fs/promises";

import {
    useApp,
} from "./init/express.mjs";

/**
 * Setup protocol - http
 * @param {object} app
 * @return {Promise<object>} the setup status
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
 * @param {object} app
 * @return {Promise<object>} the setup status
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
 * @return {object} the application invoker
 */
export function invokeApp() {
    return {
        loadPromises,
        loadRoutes,
        execute,
    };
}

// Define preparing promises
const preparingPromises = [];

/**
 * Load promises to be executed before running the application.
 * @param {Promise[]} promises the promises to load
 * @return {object} the application invoker
 */
function loadPromises(promises) {
    if (promises.length < 1) {
        return invokeApp();
    }

    preparingPromises.push(...promises);
    return invokeApp();
}

/**
 * Load routes from specified router names.
 * @param {string[]} routerNames the names of the routers to load
 * @return {object} the application invoker
 */
function loadRoutes(routerNames) {
    const routeDirectory = new URL("routes/", import.meta.url);
    const routeFilenames = routerNames.map(
        (n) => new URL(`${n}.mjs`, routeDirectory),
    );

    const routerMappers = routeFilenames.map((n) => import(n));
    routerMappers.forEach((c) => c.then((f) => f.default()));

    return invokeApp();
}

/**
 * Prepare the application and automatically detect protocols.
 * @return {Promise<void[]>} a promise that resolves when prepared
 */
async function execute() {
    // Use application
    const app = useApp();

    // Wait preparing promises
    await Promise.all(preparingPromises);

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

    return Promise.all(setupPromises);
}
