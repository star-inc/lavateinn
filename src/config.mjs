// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Import modules
import {existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import dotenv from "dotenv";

/**
 * Load configs from system environment variables.
 */
export function runLoader() {
    const dotenvPathDefault = new URL("../.env.default", import.meta.url);
    const dotenvPathInstance = new URL("../.env", import.meta.url);

    const isDotenvExists = existsSync(dotenvPathInstance);

    // Check the application configured or not,
    // '1' means it won't check the .env file exists.
    // It can't be set by any .env file, because it'll check
    // the system environment variables directly before loading the .env files.
    const isAppConfigured = process.env["APP_CONFIGURED"] === "1";

    if (!isDotenvExists && !isAppConfigured) {
        console.error(
            "No '.env' file detected in app root.",
            "If you're not using dotenv file,",
            "set 'APP_CONFIGURED=1' into environment variables.",
            "\n",
        );
        throw new Error(".env not exists");
    }

    const dotenvPaths = [
        dotenvPathInstance,
        dotenvPathDefault,
    ].map(fileURLToPath);

    dotenv.config({
        path: dotenvPaths,
    });
}

/**
 * Get the current NODE_ENV value.
 * @module src/config
 * @returns {string} The NODE_ENV value.
 */
export function getNodeEnv() {
    return get("NODE_ENV");
}

/**
 * Get the current RUNTIME_ENV value.
 * @module src/config
 * @returns {string} The RUNTIME_ENV value.
 */
export function getRuntimeEnv() {
    return get("RUNTIME_ENV");
}

/**
 * Get the current INSTANCE_MODE value.
 * @module src/config
 * @returns {string} The INSTANCE_MODE value.
 */
export function getInstanceMode() {
    return get("INSTANCE_MODE");
}

/**
 * Check is production mode.
 * @module src/config
 * @returns {boolean} True if it's production.
 */
export function isProduction() {
    return getNodeEnv() === "production";
}

/**
 * Check is cluster mode.
 * @module src/config
 * @returns {boolean} True if it's cluster mode.
 */
export function isCluster() {
    return getInstanceMode() === "cluster";
}

/**
 * Get the value from config or with an error thrown.
 * @module src/config
 * @param {string} key - The config key.
 * @returns {string} The config value.
 * @throws {Error} If value is undefined, throw an error.
 */
export function get(key) {
    const value = process.env[key];
    if (value === undefined) {
        throw new Error(`config key ${key} is undefined`);
    }
    if (value === "_disabled_") {
        return "";
    }
    return value;
}

/**
 * Get the bool value from config, if yes, returns true.
 * @module src/config
 * @param {string} key - The config key.
 * @returns {boolean} The boolean value.
 */
export function getEnabled(key) {
    return get(key) === "yes";
}

/**
 * Get the array value from config.
 * @module src/config
 * @param {string} key - The config key.
 * @param {string} [separator] - The separator.
 * @returns {string[]} The array value.
 */
export function getSplited(key, separator = ",") {
    return get(key).
        split(separator).
        filter((i) => i).
        map((i) => i.trim());
}
