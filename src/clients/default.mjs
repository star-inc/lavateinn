// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// the example of simple http client with simulated Android user agent.

// Import modules
import got from "got";

// Define the user agent
const userAgent =
    "Mozilla/5.0 (Linux; Android 4.3; HTC Butterfly Build/JSS15J) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/34.0.1847.114 Mobile Safari/537.36";

/**
 * Composable http client.
 * @module src/clients/default
 * @returns {got.Got} The http client.
 */
export function useClient() {
    return got.extend({
        headers: {
            "user-agent": userAgent,
        },
    });
}
