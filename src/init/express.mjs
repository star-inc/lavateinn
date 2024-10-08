// express.js is a web framework.

// Import modules
import {getSplited, getEnabled} from "../config.mjs";
import express from "express";

// Create middleware handlers
import middlewareHttpsRedirect from "../middleware/https_redirect.mjs";
import middlewareCORS from "../middleware/cors.mjs";
import middlewareOrigin from "../middleware/origin.mjs";

// Read config
const trustProxy = getSplited("TRUST_PROXY", ",");

const isEnabledRedirectHttpHttps = getEnabled("ENABLED_REDIRECT_HTTP_HTTPS");
const isEnabledCors = getEnabled("ENABLED_CORS");
const isEnabledCorsOriginCheck = getEnabled("ENABLED_CORS_ORIGIN_CHECK");

// Initialize app engine
const app = express();

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

// Export useFunction
export const useApp = () => app;

// Export express for shortcut
export {express};
