"use strict";

// Import config
import {
    getMust,
    getSplited,
} from "./config.mjs";

// Import modules
import http from "node:http";
import https from "node:https";

import {
    readFile,
} from "node:fs/promises";

/**
 * Setup protocol - http
 * @param {object} app
 * @param {function} callback
 */
function setupHttpProtocol(app, callback) {
    const protocol = "http";
    const hostname = getMust("HTTP_HOSTNAME");
    const port = parseInt(getMust("HTTP_PORT"));

    const httpServer = http.createServer({}, app);
    httpServer.listen(port, hostname);
    callback({protocol, hostname, port});
}

/**
 * Setup protocol - https
 * @param {object} app
 * @param {function} callback
 */
async function setupHttpsProtocol(app, callback) {
    const protocol = "https";
    const hostname = getMust("HTTPS_HOSTNAME");
    const port = parseInt(getMust("HTTPS_PORT"));

    const [key, cert] = await Promise.all([
        readFile(getMust("HTTPS_KEY_PATH")),
        readFile(getMust("HTTPS_CERT_PATH")),
    ]);

    const httpsServer = https.createServer({key, cert}, app);
    httpsServer.listen(port, hostname);

    callback({protocol, hostname, port});
}

/**
 * Prepare application and detect protocols automatically
 * @param {object} app
 * @param {array} prepareHandlers
 * @param {function} callback
 */
export default async function execute(app, prepareHandlers, callback) {
    // Waiting for prepare handlers
    if (prepareHandlers.length > 0) {
        const preparingPromises = prepareHandlers.map((c) => c());
        await Promise.all(preparingPromises);
    }

    // Get enabled protocols
    const enabledProtocols = getSplited("ENABLED_PROTOCOLS");

    // Setup HTTP
    if (enabledProtocols.includes("http")) {
        setupHttpProtocol(app, callback);
    }

    // Setup HTTPS
    if (enabledProtocols.includes("https")) {
        setupHttpsProtocol(app, callback);
    }
}
