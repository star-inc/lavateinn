// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Interrupt the request
// which is not satisfied with the result from express-validator.

// Import modules
import {validationResult} from "express-validator";
import {express, StatusCodes} from "../init/express.mjs";
import {useLogger} from "../init/logger.mjs";

// Use composable functions
const logger = useLogger();

/**
 * Middleware for inspecting the request errors.
 * @module src/middleware/inspector
 * @param {express.Request} req - The request.
 * @param {express.Response} res - The response.
 * @param {express.Handler} next - The next handler.
 * @returns {void}
 */
export default function middlewareInspector(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
        return;
    }

    // Log the warning
    logger.warn("A bad request received:", errors);

    res.
        status(StatusCodes.BAD_REQUEST).
        send({errors: errors.array()});
}
