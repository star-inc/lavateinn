// The simple toolbox for fetching visitor information from HTTP request.

/**
 * Get IP Address.
 * @module visitor
 * @function
 * @param {object} req the request
 * @return {string} the IP Address
 */
export function getIPAddress(req) {
    return req?.clientIp || req.ip;
}

/**
 * Get User-Agent.
 * @module visitor
 * @function
 * @param {object} req the request
 * @return {string} the User-Agent
 */
export function getUserAgent(req) {
    return req.header("user-agent") || "Unknown";
}
