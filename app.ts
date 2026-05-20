// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Auto-load config
import "./src/init/config.ts";

// Import constants
import {
    APP_NAME,
} from "./src/init/const.ts";

// Import instance variables
import {
    instanceContext,
    instanceRole,
} from "./src/init/instance.ts";

// Import modules
import {
    getInstanceMode,
    getNodeEnv,
    getRuntimeEnv,
} from "./src/config.ts";
import {
    invokeApp,
    type ProtocolStatus,
} from "./src/execute.ts";

import {
    useLogger,
} from "./src/init/logger.ts";
import {
    addInitTask,
} from "./src/init/scheduler.ts";

import {
    initHandler as sequelizeInitHandler,
} from "./src/init/sequelize.ts";

import {
    exitHandler as tempExitHandler,
} from "./src/init/temp.ts";

// Define router names
const routerNames = [
    "root",
    "example",
];

// Define init handlers
const initHandlers = [
    sequelizeInitHandler,
    () => {
        const logger = useLogger();
        logger.warn("The example to handle init signals.");
        addInitTask("* * * * *", "example");
    },
];

// Define exit handlers
const exitHandlers = [
    tempExitHandler,
    () => {
        const logger = useLogger();
        logger.warn("The example to handle exit signals.");
    },
];

// Define display
const displayStatus = (protocolStatus: ProtocolStatus[]): void => {
    // Display the status of the application
    if (instanceRole !== "worker") {
        // Get node and runtime environment information.
        const nodeEnv = getNodeEnv();
        const runtimeEnv = getRuntimeEnv();
        const instanceMode = getInstanceMode();

        // Display the status
        console.info(APP_NAME);
        console.info("====");
        console.info(`Environment: ${nodeEnv}, ${runtimeEnv}`);
        console.info(`Instance Mode: ${instanceMode}`);
    }

    // Display the protocol status
    if (instanceRole === "single" || instanceContext.get("workerId") === 1) {
        // Define the view
        const viewIt = ({protocol, hostname, port}: ProtocolStatus) => {
            console.info("----");
            console.info(`Protocol "${protocol}" is listening at`);
            console.info(`${protocol}://${hostname}:${port}`);
        };
        // Display the status
        protocolStatus.
            filter((i) => i.protocol).
            forEach(viewIt);
    }
};

// Mount application and execute it
invokeApp().
    loadRoutes(routerNames).
    loadInits(initHandlers).
    loadExits(exitHandlers).
    execute().
    then(displayStatus);
