// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Auto-load config
import "../src/init/config.mjs";

// Override environment variables
process.env["NODE_ENV"] = "test";
