"use strict";
// express.js is a web framework.

// Import config
import {getEnabled} from "../config.mjs";
import express from "express";

// Initialize app engine
const app = express();

// Create middleware handlers
import requestIpMiddleware from "request-ip";
import middlewareHttpsRedirect from "../middleware/https_redirect.mjs";
import middlewareCORS from "../middleware/cors.mjs";
import middlewareOrigin from "../middleware/origin.mjs";

// Read config
const isEnabledRedirectHttpHttps = getEnabled("ENABLED_REDIRECT_HTTP_HTTPS");
const isEnabledCors = getEnabled("ENABLED_CORS");
const isEnabledCorsOriginCheck = getEnabled("ENABLED_CORS_ORIGIN_CHECK");

// Register global middleware
app.use(requestIpMiddleware.mw());

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

// Export useFunction
export const useApp = () => app;

// Export express for shortcut
export {express};
