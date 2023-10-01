"use strict";
// Cross-Origin Resource Sharing

// Import config
import {getMust} from "../config.mjs";

// Import cors
import cors from "cors";

// Read config
const corsOrigin = getMust("CORS_ORIGIN");

// Export (function)
export default cors({
    origin: corsOrigin,
});
