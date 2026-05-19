// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Instance middleware
// Inject instance variables to the application.

// Import modules
import type {Request, Response, NextFunction} from "express";

import {
    instanceId,
    instanceUrl,
    instanceRole,
    instanceContext,
} from "../init/instance.ts";

/**
 * Middleware to inject instance variables.
 * @param req - The express request.
 * @param res - The express response.
 * @param next - The express next function.
 */
export default function middlewareInstance(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    // Inject instance variables to request
    Object.defineProperty(req, "instance", {
        value: {
            id: instanceId,
            url: instanceUrl,
            role: instanceRole,
            context: instanceContext,
        },
        writable: false,
        enumerable: true,
        configurable: false,
    });

    // Inject instance variables to response
    res.setHeader("X-Lavateinn-Instance-Id", instanceId);

    // Call next function
    next();
}
