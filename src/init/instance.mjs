// define application instance variables here.
// to be used for identity in clusters.

// Import constants
import {
    APP_NAME,
} from "./const.mjs";

// Import modules
import {
    nanoid,
} from "nanoid";
import {
    getMust,
    isCluster,
} from "../config.mjs";

// Define instance id
export const instanceId = (() => {
    if (!isCluster()) return APP_NAME;
    return `${APP_NAME}#${nanoid()}`;
})();

// Define instance http url (aka. canonical url)
export const instanceUrl = getMust("INSTANCE_URL");

// Define instance context
const instanceContext = new Map();

/**
 * Composable global context of the instance.
 * @returns {Map} The instance context.
 */
export function useInstanceContext() {
    return instanceContext;
}
