// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Cross-Origin Resource Sharing

// Import modules
import {get} from "../config.ts";
import {cors} from "hono/cors";

// Read configuration
const origin = get("CORS_ORIGIN");

// Export (function)
export default cors({
    origin,
});
