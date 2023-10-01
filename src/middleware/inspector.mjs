"use strict";
// Interrupt the request
// which is not satisfied with the result from express-validator.

// Import isProduction
import {isProduction} from "../config.mjs";

// Import StatusCodes
import {StatusCodes} from "http-status-codes";

// Import validationResult
import {validationResult} from "express-validator";

// Export (function)
export default (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
    } else {
        if (!isProduction()) {
            // Debug message
            console.warn(
                "A bad request received:",
                errors,
            );
        }
        res
            .status(StatusCodes.BAD_REQUEST)
            .mjson({errors: errors.array()});
    }
};
