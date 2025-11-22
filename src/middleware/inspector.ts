// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Interrupt the request
// which is not satisfied with the result from express-validator.

// Import modules
import {validationResult} from "express-validator";
import {StatusCodes} from "../init/express.ts";
import {useLogger} from "../init/logger.ts";
import type {Request, Response, NextFunction} from "express";

// Use composable functions
const logger = useLogger();

/**
 * Middleware for inspecting the request errors.
 * @param req - The request.
 * @param res - The response.
 * @param next - The next handler.
 */
export default function middlewareInspector(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
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
