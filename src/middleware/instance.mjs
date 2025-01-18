// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Instance middleware
// Inject instance variables to the application.

// Import modules
import {express} from "../init/express.mjs";

import {
    instanceId,
    instanceUrl,
    instanceRole,
    instanceContext,
} from "../init/instance.mjs";

/**
 * Middleware to inject instance variables.
 * @module src/init/instance
 * @param {express.Request} req - The express request.
 * @param {express.Response} res - The express response.
 * @param {express.NextFunction} next - The express next function.
 * @returns {void}
 */
export default function middlewareInstance(req, res, next) {
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
