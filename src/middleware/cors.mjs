// Cross-Origin Resource Sharing

// Import modules
import {getMust} from "../config.mjs";
import cors from "cors";

// Read config
const origin = getMust("CORS_ORIGIN");

// Export (function)
export default cors({origin});
