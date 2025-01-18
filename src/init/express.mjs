// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// express.js is a web framework.

// Import modules
import express from "express";
import {StatusCodes} from "http-status-codes";

// Import config
import {getSplited, getEnabled} from "../config.mjs";

// Import middleware
import middlewareInstance from "../middleware/instance.mjs";
import middlewareHttpsRedirect from "../middleware/https_redirect.mjs";
import middlewareCORS from "../middleware/cors.mjs";
import middlewareOrigin from "../middleware/origin.mjs";

// Read configuration
const trustProxy = getSplited("TRUST_PROXY", ",");

const isEnabledRedirectHttpHttps = getEnabled("ENABLED_REDIRECT_HTTP_HTTPS");
const isEnabledCors = getEnabled("ENABLED_CORS");
const isEnabledCorsOriginCheck = getEnabled("ENABLED_CORS_ORIGIN_CHECK");

// Initialize app engine
const app = express();

// Required middleware
app.use(middlewareInstance);

// Optional settings
if (trustProxy.length) {
    app.set("trust proxy", trustProxy);
}

// Optional middleware
if (isEnabledRedirectHttpHttps) {
    // Do https redirects
    app.use(middlewareHttpsRedirect);
}
if (isEnabledCors) {
    // Do CORS handles
    app.use(middlewareCORS);
}
if (isEnabledCors && isEnabledCorsOriginCheck) {
    // Check header "Origin" for CORS
    app.use(middlewareOrigin);
}

/**
 * Composable application.
 * @module src/init/express
 * @returns {express.Application} The express app.
 */
export function useApp() {
    return app;
}

// Export express for shortcut
export {express, StatusCodes};
