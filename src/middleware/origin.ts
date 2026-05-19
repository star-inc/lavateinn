// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Check the header "Origin" in the request is equal to CORS_ORIGIN,
// if not, interrupt it.

// Import modules
import type {Context, Next} from "hono";
import type {StatusCode} from "hono/utils/http-status";
import {get} from "../config.ts";
import {StatusCodes} from "../init/hono.ts";
import {useLogger} from "../init/logger.ts";

// Use composable functions
const logger = useLogger();

/**
 * Middleware for checking the request origin.
 * @param c - The hono context.
 * @param next - The hono next handler.
 * @returns The Hono response or void.
 */
export default async function middlewareOrigin(
    c: Context,
    next: Next,
): Promise<Response | void> {
    // Extract the request
    const origin = c.req.header("Origin");

    // Check if the request has CORS origin header
    if (!origin) {
        // Log the warning
        logger.warn("CORS origin header is not detected");
        await next();
        return;
    }

    // Get expected URL
    const expectedUrl = get("CORS_ORIGIN");

    // Origin match
    if (origin === expectedUrl) {
        await next();
        return;
    }

    // Log the warning
    logger.warn(
        "CORS origin header mismatch:",
        `actual "${origin}"`,
        `expected "${expectedUrl}"`,
    );

    // Send the response
    c.status(StatusCodes.FORBIDDEN as StatusCode);
    return c.body(null);
}
