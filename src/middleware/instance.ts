// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Instance middleware
// Inject instance variables to the application.

import type {Context, Next} from "hono";
import type {HonoEnv} from "../types/hono.ts";

// Import modules
import {
    instanceContext,
    instanceId,
    instanceRole,
    instanceUrl,
} from "../init/instance.ts";

/**
 * Middleware to inject instance variables.
 * @param c - The hono context.
 * @param next - The hono next function.
 * @returns Promise that resolves when finished.
 */
export default async function middlewareInstance(
    c: Context<HonoEnv>,
    next: Next,
): Promise<void> {
    // Inject instance variables to context
    c.set("instance", {
        id: instanceId,
        url: instanceUrl,
        role: instanceRole,
        context: instanceContext,
    });

    // Inject instance variables to response
    c.header("X-Lavateinn-Instance-Id", instanceId);

    // Call next function
    await next();
}
