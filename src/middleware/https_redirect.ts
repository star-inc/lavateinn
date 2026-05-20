// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Redirect http to https.

// Import modules
import type {Context, Next} from "hono";
import type {RedirectStatusCode} from "hono/utils/http-status";
import {StatusCodes} from "../init/hono.ts";
import {useLogger} from "../init/logger.ts";

// Use composable functions
const logger = useLogger();

/**
 * Middleware for redirecting HTTP to HTTPS.
 * @param c - The hono context.
 * @param next - The hono next function.
 * @returns Promise that resolves when finished.
 */
export default async function middlewareHttpsRedirect(
    c: Context,
    next: Next,
): Promise<Response | void> {
    // Extract the request
    const url = new URL(c.req.url);

    // If the protocol is not http, skip
    if (url.protocol !== "http:") {
        // Call next middleware
        await next();
        return;
    }

    // Log the warning
    logger.warn(`Pure HTTP protocol detected from "${url.host}"`);

    // Construct the next URL
    url.protocol = "https:";

    // Redirect to https
    return c.redirect(
        url.toString(),
        StatusCodes.MOVED_PERMANENTLY as RedirectStatusCode,
    );
}
