// define application instance variables here.
// to be used for identity in clusters.

// Import constants
import {
    APP_NAME,
} from "./const.mjs";

// Import modules
import {
    isPrimary,
} from "node:cluster";
import {
    nanoid,
} from "nanoid";

import {
    getMust,
} from "../config.mjs";

// Define instance id
export const instanceId = `${APP_NAME}#${nanoid()}`;

// Define instance http url (aka. canonical url)
export const instanceUrl = getMust("INSTANCE_URL");

// Define instance role (primary or worker)
export const instanceRole = isPrimary ? "primary" : "worker";

// Define instance context
export const instanceContext = new Map();
