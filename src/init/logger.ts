// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// winston is a powerful logging library.

// Import modules
import winston from "winston";
import {get, getEnabled} from "../config.ts";
import {
    instanceContext,
} from "./instance.ts";

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

const useLoggingHttp = () => {
    if (!loggingHttpUrl) {
        return false;
    }
    const url = new URL(loggingHttpUrl);
    return new winston.transports.Http({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
        ),
        host: url.hostname,
        port: parseInt(url.port || "80"),
        path: url.pathname,
    });
};

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
 * @returns The logger.
 */
export function useLogger(): winston.Logger {
    // Return the existing instance if exists
    if (instanceContext.has("Logger")) {
        return instanceContext.get("Logger");
    }

    // Create logger
    const transports: winston.transport[] = [];
    const consoleTransport = useLoggingConsole();
    if (consoleTransport) {
        transports.push(consoleTransport);
    }
    const httpTransport = useLoggingHttp();
    if (httpTransport) {
        transports.push(httpTransport);
    }
    const fileTransport = useLoggingFile();
    if (fileTransport) {
        transports.push(fileTransport);
    }

    const logger = winston.createLogger({
        transports,
        level: loggingLevel,
    });

    // Store the logger instance
    instanceContext.set("Logger", logger);

    // Return the logger
    return logger;
}
