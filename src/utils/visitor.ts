// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// The simple toolbox for fetching visitor information from HTTP request.

import type {Context} from "hono";
import {isProduction} from "../config.ts";
import {getConnInfo} from "@hono/node-server/conninfo";

/**
 * Get IP Address.
 * @param c - The hono context.
 * @returns The IP Address.
 */
export function getIPAddress(c: Context): string {
    if (!isProduction()) {
        return "127.0.0.1";
    }
    const info = getConnInfo(c);
    return info.remote.address || "127.0.0.1";
}

/**
 * Get User-Agent.
 * @param c - The hono context.
 * @returns The User-Agent.
 */
export function getUserAgent(c: Context): string {
    return c.req.header("user-agent") || "Unknown";
}
