// Check the header "Origin" in the request is equal to CORS_ORIGIN,
// if not, interrupt it.

// Import modules
import {isProduction, getMust} from "../config.mjs";
import {StatusCodes} from "http-status-codes";
import {isObjectPropExists} from "../utils/native.mjs";

// Export (function)
export default (req, res, next) => {
    // Check if the request has CORS origin header
    if (!isObjectPropExists(req.headers, "origin")) {
        if (!isProduction()) {
            // Debug message
            console.warn("CORS origin header is not detected");
        }
        next();
        return;
    }

    // Get actual and expected URLs
    const actualUrl = req.header("origin");
    const expectedUrl = getMust("CORS_ORIGIN");

    // Origin match
    if (actualUrl === expectedUrl) {
        if (!isProduction()) {
            // Debug message
            console.warn(
                "CORS origin header match:",
                `actual "${actualUrl}"`,
                `expected "${expectedUrl}"`,
            );
        }
        next();
        return;
    }

    // Origin mismatch
    if (!isProduction()) {
        // Debug message
        console.warn(
            "CORS origin header mismatch:",
            `actual "${actualUrl}"`,
            `expected "${expectedUrl}"`,
        );
    }
    res.sendStatus(StatusCodes.FORBIDDEN);
};
