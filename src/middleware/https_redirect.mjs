// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Redirect http to https.

// Import modules
import {express, StatusCodes} from "../init/express.mjs";
import {useLogger} from "../init/logger.mjs";

// Use composable functions
const logger = useLogger();

/**
 * Middleware for redirecting HTTP to HTTPS.
 * @module src/middleware/https_redirect
 * @param {express.Request} req - The request.
 * @param {express.Response} res - The response.
 * @param {express.NextFunction} next - The next handler.
 * @returns {void}
 */
export default function middlewareHttpsRedirect(req, res, next) {
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
