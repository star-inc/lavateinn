// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// The simple toolbox for fetching visitor information from HTTP request.

import {isProduction} from "../config.ts";
import type {Request} from "express";

/**
 * Get IP Address.
 * @param req - The request.
 * @returns The IP Address.
 */
export function getIPAddress(req: Request): string {
    if (!isProduction()) {
        return "127.0.0.1";
    }
    return req.ip || "127.0.0.1";
}

/**
 * Get User-Agent.
 * @param req - The request.
 * @returns The User-Agent.
 */
export function getUserAgent(req: Request): string {
    return req.header("user-agent") || "Unknown";
}
