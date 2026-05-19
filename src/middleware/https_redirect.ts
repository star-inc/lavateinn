// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Redirect http to https.

// Import modules
import {StatusCodes} from "../init/express.ts";
import {useLogger} from "../init/logger.ts";
import type {Request, Response, NextFunction} from "express";

// Use composable functions
const logger = useLogger();

/**
 * Middleware for redirecting HTTP to HTTPS.
 * @param req - The request.
 * @param res - The response.
 * @param next - The next handler.
 */
export default function middlewareHttpsRedirect(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    // Extract the request
    const {protocol, host, url} = req;

    // If the protocol is not http, skip
    if (protocol !== "http") {
        // Call next middleware
        next();
        return;
    }

    // Log the warning
    logger.warn(`Pure HTTP protocol detected from "${host}"`);

    // Construct the next URL
    const nextUrl = `https://${host}${url}`;

    // Redirect to https
    res.redirect(StatusCodes.MOVED_PERMANENTLY, nextUrl);
}
