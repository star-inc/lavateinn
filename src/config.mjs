// Import modules
import {existsSync} from "node:fs";
import dotenv from "dotenv";
import {useLogger} from "./init/logger.mjs";

// Use composable functions
const logger = useLogger();

/**
 * Load configs from system environment variables.
 */
export function runLoader() {
    const dotenvPath = new URL("../.env", import.meta.url);

    const isDotEnvFileExists = existsSync(dotenvPath);
    const isCustomDefined = get("APP_CONFIGURED") === "1";

    if (!isDotEnvFileExists && !isCustomDefined) {
        logger.error(
            "No '.env' file detected in app root.",
            "If you're not using dotenv file,",
            "set 'APP_CONFIGURED=1' into environment variables.",
            "\n",
        );
        throw new Error(".env not exists");
    }

    dotenv.config();
}

/**
 * Check is production mode.
 * @module src/config
 * @returns {boolean} True if it's production.
 */
export function isProduction() {
    return getMust("NODE_ENV") === "production";
}

/**
 * Get overview of current environment.
 * @module src/config
 * @returns {object} The overview.
 */
export function getOverview() {
    return {
        node: getFallback("NODE_ENV", "development"),
        runtime: getFallback("RUNTIME_ENV", "native"),
    };
}

/**
 * Shortcut to get config value.
 * @module src/config
 * @param {string} key - The config key.
 * @returns {string} The config value.
 */
export function get(key) {
    return process.env[key];
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
export function getSplited(key, separator=",") {
    return getMust(key).
        split(separator).
        filter((s) => s).
        map((s) => s.trim());
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
