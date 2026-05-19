// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// The solution to defense from brute-force attacks,

// Import modules
import type {Context, MiddlewareHandler, Next} from "hono";
import type {StatusCode} from "hono/utils/http-status";
import {StatusCodes} from "../init/hono.ts";
import {useCache} from "../init/cache.ts";
import {useLogger} from "../init/logger.ts";
import {getIPAddress} from "../utils/visitor.ts";

// Use composable functions
const logger = useLogger();

/**
 * Get path key from request.
 * @param c - The hono context.
 * @param isParam - To detect param mode or not.
 * @returns The path key.
 */
function getPathKey(c: Context, isParam: boolean): string {
    const pathArray = c.req.path.split("/").filter((i) => !!i);
    if (isParam) {
        pathArray.pop();
    }
    return pathArray.join(".");
}

/**
 * Callback function for forbidden requests.
 */
type ForbiddenCallback = (actual: number, expect: number) => void;

/**
 * Construct a middleware handler for restricting the request.
 * @param max - The maximum number of requests allowed per IP address.
 * @param ttl - The time to live in seconds to unblock the IP address
 * if no request comes. If set to 0, it will be blocked forever
 * until the software is restarted.
 * @param isParam - The flag to remove the last path from the key.
 * @param [customForbiddenStatus] - The custom status code for
 * forbidden requests, optional.
 * @param [customForbiddenCallback] - The custom callback
 * for forbidden requests, optional.
 * @returns The middleware handler.
 */
export default function useMiddlewareRestrictor(
    max: number,
    ttl: number,
    isParam: boolean,
    customForbiddenStatus: number | null = null,
    customForbiddenCallback: ForbiddenCallback | null = null,
): MiddlewareHandler {
    /**
     * Middleware for restricting the request.
     * @param c - The hono context.
     * @param next - The hono next handler.
     * @returns The Hono response or void.
     */
    return async function middlewareRestrictor(
        c: Context,
        next: Next,
    ): Promise<Response | void> {
        // Define the query key
        const pathKey = getPathKey(c, isParam);
        const ipAddress = getIPAddress(c);
        const queryKey = ["restrictor", pathKey, ipAddress].join(":");

        // Get the cache instance
        const cache = useCache();

        // Get the key value
        const keyValue = (await cache.get<number>(queryKey)) || 0;

        // Define the increase value function
        const increaseValue = async () => {
            const offset = keyValue ? keyValue + 1 : 1;
            await cache.set(queryKey, offset, ttl);
        };

        if (keyValue > max) {
            // Log the warning
            logger.warn(
                "Too many forbidden requests received:",
                `actual "${keyValue}"`,
                `expect "${max}"`,
            );

            // Send the response
            c.status(StatusCodes.TOO_MANY_REQUESTS as StatusCode);
            const res = c.body(null);

            // Call the custom callback
            customForbiddenCallback?.(keyValue, max);

            // Increase the value
            await increaseValue();

            // Return
            return res;
        }

        // Call next middleware
        await next();

        // Define the forbidden status code
        const forbiddenStatus = (
            customForbiddenStatus ?? StatusCodes.FORBIDDEN
        );

        // Check if the response status code is not forbidden
        if (c.res.status !== forbiddenStatus) {
            return;
        }

        // Log the warning
        logger.warn(
            "An forbidden request detected:",
            forbiddenStatus,
            queryKey,
        );

        // Increase the value
        await increaseValue();
    };
}
