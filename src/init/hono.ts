// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// hono.ts is a web framework.

// Import modules
import {Hono} from "hono";
import {StatusCodes} from "http-status-codes";

// Import config
import {getEnabled} from "../config.ts";

// Import types
import type {HonoEnv} from "../types/hono.ts";

// Import middleware
import middlewareInstance from "../middleware/instance.ts";
import middlewareHttpsRedirect from "../middleware/https_redirect.ts";
import middlewareCORS from "../middleware/cors.ts";
import middlewareOrigin from "../middleware/origin.ts";

const isEnabledRedirectHttpHttps = getEnabled("ENABLED_REDIRECT_HTTP_HTTPS");
const isEnabledCors = getEnabled("ENABLED_CORS");
const isEnabledCorsOriginCheck = getEnabled("ENABLED_CORS_ORIGIN_CHECK");

// Initialize app engine
let app: Hono<HonoEnv>;

/**
 * Composable application.
 * @returns The hono app.
 */
export function useApp(): Hono<HonoEnv> {
    return app;
}

/**
 * Reset application.
 * @returns The hono app.
 */
export function resetApp(): Hono<HonoEnv> {
    const newApp = new Hono<HonoEnv>();
    newApp.use("*", middlewareInstance);
    if (isEnabledRedirectHttpHttps) {
        newApp.use("*", middlewareHttpsRedirect);
    }
    if (isEnabledCors) {
        newApp.use("*", middlewareCORS);
    }
    if (isEnabledCors && isEnabledCorsOriginCheck) {
        newApp.use("*", middlewareOrigin);
    }
    app = newApp;
    return newApp;
}

app = resetApp();

// Export hono for shortcut
export {app as hono, StatusCodes};
