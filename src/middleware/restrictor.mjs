// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// The solution to defense from brute-force attacks,

// Import modules
import {express, StatusCodes} from "../init/express.mjs";
import {useCache} from "../init/cache.mjs";
import {useLogger} from "../init/logger.mjs";
import {getIPAddress} from "../utils/visitor.mjs";

// Use composable functions
const logger = useLogger();

/**
 * Get path key from request.
 * @module src/middleware/restrictor
 * @param {object} req - The request.
 * @param {boolean} isParam - To detect param mode or not.
 * @returns {string} The path key.
 */
function getPathKey(req, isParam) {
    const pathArray = req.originalUrl.split("/").filter((i) => !!i);
    if (isParam) {
        pathArray.pop();
    }
    return pathArray.join(".");
}

/**
 * @callback ForbiddenCallback
 * @param {number} actual - The actual number of requests.
 * @param {number} expect - The expected number of requests.
 * @returns {void}
 */

/**
 * Construct a middleware handler for restricting the request.
 * @module src/middleware/restrictor
 * @param {number} max - The maximum number of requests allowed per IP address.
 * @param {number} ttl - The time to live in seconds to unblock the IP address
 * if no request comes. If set to 0, it will be blocked forever
 * until the software is restarted.
 * @param {boolean} isParam - The flag to remove the last path from the key.
 * @param {number} [customForbiddenStatus] - The custom status code for
 * forbidden requests, optional.
 * @param {ForbiddenCallback} [customForbiddenCallback] - The custom callback
 * for forbidden requests, optional.
 * @returns {express.Handler} The middleware handler.
 */
export default function useMiddlewareRestrictor(
    max, ttl, isParam,
    customForbiddenStatus=null,
    customForbiddenCallback=null,
) {
    /**
     * Middleware for restricting the request.
     * @module src/middleware/restrictor
     * @function
     * @param {express.Request} req - The request.
     * @param {express.Response} res - The response.
     * @param {express.NextFunction} next - The next handler.
     * @returns {void}
     */
    function middlewareRestrictor(req, res, next) {
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
