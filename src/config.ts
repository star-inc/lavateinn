// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Import modules
import {existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import dotenv from "dotenv";

/**
 * Load configs from system environment variables.
 */
export function runLoader(): void {
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
    ].map((path) => fileURLToPath(path));

    dotenv.config({
        path: dotenvPaths,
    });
}

/**
 * Get the current NODE_ENV value.
 * @returns The NODE_ENV value.
 */
export function getNodeEnv(): string {
    return get("NODE_ENV");
}

/**
 * Get the current RUNTIME_ENV value.
 * @returns The RUNTIME_ENV value.
 */
export function getRuntimeEnv(): string {
    return get("RUNTIME_ENV");
}

/**
 * Get the current INSTANCE_MODE value.
 * @returns The INSTANCE_MODE value.
 */
export function getInstanceMode(): string {
    return get("INSTANCE_MODE");
}

/**
 * Check is production mode.
 * @returns True if it's production.
 */
export function isProduction(): boolean {
    return getNodeEnv() === "production";
}

/**
 * Check is cluster mode.
 * @returns True if it's cluster mode.
 */
export function isCluster(): boolean {
    return getInstanceMode() === "cluster";
}

/**
 * Get the value from config or with an error thrown.
 * @param key - The config key.
 * @returns The config value.
 * @throws {Error} If value is undefined, throw an error.
 */
export function get(key: string): string {
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
 * @param key - The config key.
 * @returns The boolean value.
 */
export function getEnabled(key: string): boolean {
    return get(key) === "yes";
}

/**
 * Get the array value from config.
 * @param key - The config key.
 * @param [separator] - The separator.
 * @returns The array value.
 */
export function getSplitted(key: string, separator = ","): string[] {
    return get(key).
        split(separator).
        filter((i) => i).
        map((i) => i.trim());
}
