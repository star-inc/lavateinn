// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Check the header "Origin" in the request is equal to CORS_ORIGIN,
// if not, interrupt it.

// Import modules
import {get} from "../config.mjs";
import {express, StatusCodes} from "../init/express.mjs";
import {useLogger} from "../init/logger.mjs";

// Use composable functions
const logger = useLogger();

/**
 * Middleware for checking the request origin.
 * @module src/middleware/origin
 * @param {express.Request} req - The request.
 * @param {express.Response} res - The response.
 * @param {express.NextFunction} next - The next handler.
 * @returns {void}
 */
export default function middlewareOrigin(req, res, next) {
    // Extract the request
    const origin = req.header("Origin");

    // Check if the request has CORS origin header
    if (!origin) {
        // Log the warning
        logger.warn("CORS origin header is not detected");
        next();
        return;
    }

    // Get actual and expected URLs
    const actualUrl = req.header("origin");
    const expectedUrl = get("CORS_ORIGIN");

    // Origin match
    if (actualUrl === expectedUrl) {
        next();
        return;
    }

    // Log the warning
    logger.warn(
        "CORS origin header mismatch:",
        `actual "${actualUrl}"`,
        `expected "${expectedUrl}"`,
    );

    // Send the response
    res.sendStatus(StatusCodes.FORBIDDEN);
}
