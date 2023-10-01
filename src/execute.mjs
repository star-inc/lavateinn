"use strict";

// Import config
import {getMust, getSplited} from "./config.mjs";

// Import modules
import {promises as fs} from "node:fs";
import http from "node:http";
import https from "node:https";

/**
 * Setup protocol - http
 * @param {object} app
 * @param {function} callback
 */
function setupHttpProtocol(app, callback) {
    const options = {};
    const httpServer = http.createServer(options, app);
    const port = parseInt(getMust("HTTP_PORT"));
    httpServer.listen(port, getMust("HTTP_HOSTNAME"));
    callback({protocol: "http", hostname: getMust("HTTP_HOSTNAME"), port});
}

/**
 * Setup protocol - https
 * @param {object} app
 * @param {function} callback
 */
async function setupHttpsProtocol(app, callback) {
    const options = {
        key: await fs.readFile(getMust("HTTPS_KEY_PATH")),
        cert: await fs.readFile(getMust("HTTPS_CERT_PATH")),
    };
    const httpsServer = https.createServer(options, app);
    const port = parseInt(getMust("HTTPS_PORT"));
    httpsServer.listen(port, getMust("HTTPS_HOSTNAME"));
    callback({protocol: "https", hostname: getMust("HTTPS_HOSTNAME"), port});
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
