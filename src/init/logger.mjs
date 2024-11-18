// winston is a powerful logging library.

// Import constants
import {
    APP_NAME,
} from "./const.mjs";

// Import modules
import winston from "winston";

// Default log transports
const logConsole = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
    ),
});
const logFile = new winston.transports.File({
    filename: `${APP_NAME}.log`,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
});

/**
 * Composable logger.
 * @module src/init/logger
 * @param {string} level - The log level.
 * @returns {winston.Logger} The logger.
 */
export function useLogger(level) {
    return winston.createLogger({
        transports: [logConsole, logFile],
        level: level || "info",
    });
}
