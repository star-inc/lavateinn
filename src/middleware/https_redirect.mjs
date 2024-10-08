// Redirect http to https.

// Import modules
import {isProduction} from "../config.mjs";
import {StatusCodes} from "http-status-codes";

// Export (function)
export default (req, res, next) => {
    if (req.protocol !== "http") {
        // Call next middleware
        next();
        return;
    }

    if (!isProduction()) {
        // Debug message
        console.warn(
            "Pure HTTP protocol detected:",
            `from "${req.hostname}"`,
            `with host header "${req.headers.host}"`,
            `with origin header "${req.headers.origin}"`,
        );
    }

    // Redirect to https
    const nextUrl = `https://${req.headers.host}${req.url}`;
    res.redirect(StatusCodes.MOVED_PERMANENTLY, nextUrl);
};
