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
    const isAppConfigured = get("APP_CONFIGURED") === "1";

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
    return getFallback("NODE_ENV", "development");
}

/**
 * Get the current RUNTIME_ENV value.
 * @module src/config
 * @returns {string} The RUNTIME_ENV value.
 */
export function getRuntimeEnv() {
    return getFallback("RUNTIME_ENV", "native");
}

/**
 * Get the current INSTANCE_MODE value.
 * @module src/config
 * @returns {string} The INSTANCE_MODE value.
 */
export function getInstanceMode() {
    return getFallback("INSTANCE_MODE", "single");
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
 * Shortcut to get config value.
 * @module src/config
 * @param {string} key - The config key.
 * @returns {string} The config value.
 */
export function get(key) {
    const value = process.env[key];
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
    return getMust(key) === "yes";
}

/**
 * Get the array value from config.
 * @module src/config
 * @param {string} key - The config key.
 * @param {string} [separator] - The separator.
 * @returns {string[]} The array value.
 */
export function getSplited(key, separator = ",") {
    return getMust(key).
        split(separator).
        filter((i) => i).
        map((i) => i.trim());
}

/**
 * Get the value from config with error thrown.
 * @module src/config
 * @param {string} key - The config key.
 * @returns {string} The expected value.
 * @throws {Error} If value is undefined, throw an error.
 */
export function getMust(key) {
    const value = get(key);
    if (value === undefined) {
        throw new Error(`config key ${key} is undefined`);
    }
    return value;
}

/**
 * Get the value from config with fallback.
 * @module src/config
 * @param {string} key - The config key.
 * @param {string} fallback - The fallback value.
 * @returns {string} The expected value.
 */
export function getFallback(key, fallback) {
    return get(key) || fallback;
}
