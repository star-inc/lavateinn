// Interrupt the request
// which is not satisfied with the result from express-validator.

// Import modules
import {isProduction} from "../config.mjs";
import {StatusCodes} from "http-status-codes";
import {validationResult} from "express-validator";

// Export (function)
export default (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
        return;
    }

    if (!isProduction()) {
        // Debug message
        console.warn("A bad request received:", errors);
    }
    res.
        status(StatusCodes.BAD_REQUEST).
        send({errors: errors.array()});
};
