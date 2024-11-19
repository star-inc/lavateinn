// sequelize is an easy-to-use and promise-based database orm tool.

// Import modules
import sequelize, {
    Sequelize,
} from "sequelize";

import {
    getMust,
    isProduction,
} from "../config.mjs";

// Read configuration
const sequelizeUrl = getMust("SEQUELIZE_URL");

/**
 * @type {sequelize.Options}
 */
const sequelizeOptions = {
    logging: !isProduction(),
};

/**
 * Initialize the sequelize.
 */
export const initHandler = async () => {
    // If the sequelize URL is not provided, skip
    if (!sequelizeUrl) return;

    // Import models
    await import("../models/index.mjs");

    // Use sequelize
    const client = useSequelize();

    // Setup the database
    await client.authenticate();
    await client.sync();
};

/**
 * Composable Sequelize.
 * @returns {Sequelize} The sequelize instance.
 */
export function useSequelize() {
    return new Sequelize(sequelizeUrl, sequelizeOptions);
}
