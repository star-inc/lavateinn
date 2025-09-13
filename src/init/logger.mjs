// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// winston is a powerful logging library.

// Import modules
import winston from "winston";
import {get, getEnabled} from "../config.mjs";
import {
    instanceContext,
} from "./instance.mjs";

// Read configuration
const loggingLevel = get("LOGGING_LEVEL");
const isLoggingConsole = getEnabled("LOGGING_CONSOLE");
const loggingFilePath = get("LOGGING_FILE_PATH");
const loggingHttpUrl = get("LOGGING_HTTP_URL");

// Define logging configuration
const useLoggingConsole = () => isLoggingConsole &&
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        ),
    });

const useLoggingHttp = () => loggingHttpUrl &&
    new winston.transports.Http({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
        ),
        ...new URL(loggingHttpUrl),
    });

const useLoggingFile = () => loggingFilePath &&
    new winston.transports.File({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
        ),
        filename: loggingFilePath,
    });

/**
 * Composable logger.
 * @module src/init/logger
 * @returns {winston.Logger} The logger.
 */
export function useLogger() {
    // Return the existing instance if exists
    if (instanceContext.has("Logger")) {
        return instanceContext.get("Logger");
    }

    // Create logger
    const logger = winston.createLogger({
        transports: [
            useLoggingConsole(),
            useLoggingHttp(),
            useLoggingFile(),
        ].filter((i) => i),
        level: loggingLevel,
    });

    // Store the logger instance
    instanceContext.set("Logger", logger);

    // Return the logger
    return logger;
}
