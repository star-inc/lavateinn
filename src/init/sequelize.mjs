// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// sequelize is an easy-to-use and promise-based database orm tool.

// Import modules
import sequelize, {
    Sequelize,
} from "sequelize";

import {
    get,
    isProduction,
} from "../config.mjs";
import {
    instanceContext,
} from "./instance.mjs";

// Read configuration
const sequelizeUrl = get("SEQUELIZE_URL");

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
    // Return the existing instance if exists
    if (instanceContext.has("Sequelize")) {
        return instanceContext.get("Sequelize");
    }

    // Create new instance
    const client = new Sequelize(sequelizeUrl, sequelizeOptions);
    instanceContext.set("Sequelize", client);
    return client;
}
