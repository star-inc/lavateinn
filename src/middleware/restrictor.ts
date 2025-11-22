// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// The solution to defense from brute-force attacks,

// Import modules
import {StatusCodes} from "../init/express.ts";
import {useCache} from "../init/cache.ts";
import {useLogger} from "../init/logger.ts";
import {getIPAddress} from "../utils/visitor.ts";
import type {Request, Response, NextFunction} from "express";

// Use composable functions
const logger = useLogger();

/**
 * Get path key from request.
 * @param req - The request.
 * @param isParam - To detect param mode or not.
 * @returns The path key.
 */
function getPathKey(req: Request, isParam: boolean): string {
    const pathArray = req.originalUrl.split("/").filter((i) => !!i);
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
 * @param customForbiddenStatus - The custom status code for
 * forbidden requests, optional.
 * @param customForbiddenCallback - The custom callback
 * for forbidden requests, optional.
 * @returns The middleware handler.
 */
export default function useMiddlewareRestrictor(
    max: number,
    ttl: number,
    isParam: boolean,
    customForbiddenStatus: number | null = null,
    customForbiddenCallback: ForbiddenCallback | null = null,
) {
    /**
     * Middleware for restricting the request.
     * @param req - The request.
     * @param res - The response.
     * @param next - The next handler.
     */
    function middlewareRestrictor(
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        // Define the query key
        const pathKey = getPathKey(req, isParam);
        const ipAddress = getIPAddress(req);
        const queryKey = ["restrictor", pathKey, ipAddress].join(":");

        // Get the cache instance
        const cache = useCache();

        // Get the key value
        const keyValue = cache.get(queryKey);

        // Define the increase value function
        const increaseValue = () => {
            const offset = keyValue ? keyValue + 1 : 1;
            cache.set(queryKey, offset, ttl);
        };

        if (keyValue > max) {
            // Log the warning
            logger.warn(
                "Too many forbidden requests received:",
                `actual "${keyValue}"`,
                `expect "${max}"`,
            );

            // Send the response
            res.sendStatus(StatusCodes.TOO_MANY_REQUESTS);

            // Call the custom callback
            customForbiddenCallback?.(keyValue, max);

            // Increase the value
            increaseValue();

            // Return
            return;
        }

        res.on("finish", () => {
            // Define the forbidden status code
            const forbiddenStatus = (
                customForbiddenStatus ?? StatusCodes.FORBIDDEN
            );

            // Check if the response status code is not forbidden
            if (res.statusCode !== forbiddenStatus) {
                return;
            }

            // Log the warning
            logger.warn(
                "An forbidden request detected:",
                forbiddenStatus,
                queryKey,
            );

            // Increase the value
            increaseValue();
        });

        // Call next middleware
        next();
    }

    return middlewareRestrictor;
}
