// winston is a powerful logging library.

// Import modules
import winston from "winston";
import {getMust, getEnabled} from "../config.mjs";

// Read configuration
const loggingLevel = getMust("LOGGING_LEVEL");
const isLoggingConsole = getEnabled("LOGGING_CONSOLE");
const loggingFilePath = getMust("LOGGING_FILE_PATH");
const loggingHttpUrl = getMust("LOGGING_HTTP_URL");

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
    ...new URL(loggingHttpUrl),
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
});

const useLoggingFile = () => loggingFilePath &&
new winston.transports.File({
    filename: loggingFilePath,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
});

// Create logger
const logger = winston.createLogger({
    transports: [
        useLoggingConsole(),
        useLoggingHttp(),
        useLoggingFile(),
    ],
    level: loggingLevel,
});

/**
 * Composable logger.
 * @module src/init/logger
 * @returns {winston.Logger} The logger.
 */
export function useLogger() {
    return logger;
}
