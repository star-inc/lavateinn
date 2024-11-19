// Auto-load config
import "./src/init/config.mjs";

// Import constants
import {
    APP_NAME,
} from "./src/init/const.mjs";

// Import instance variables
import {
    instanceId,
} from "./src/init/instance.mjs";

// Import modules
import {
    getNodeEnv,
    getRuntimeEnv,
    getInstanceMode,
} from "./src/config.mjs";
import {
    invokeApp,
} from "./src/execute.mjs";

import {
    useLogger,
} from "./src/init/logger.mjs";

import {
    initHandler as sequelizeInitHandler,
} from "./src/init/sequelize.mjs";

import {
    initHandler as consulInitHandler,
    exitHandler as consulExitHandler,
} from "./src/init/consul.mjs";

import {
    exitHandler as tempExitHandler,
} from "./src/init/temp.mjs";

// Define router names
const routerNames = [
    "root",
    "example",
];

// Define init handlers
const initHandlers = [
    sequelizeInitHandler,
    consulInitHandler,
    () => {
        const logger = useLogger();
        logger.warn("The example to handle init signals.");
    },
];

// Define exit handlers
const exitHandlers = [
    tempExitHandler,
    consulExitHandler,
    () => {
        const logger = useLogger();
        logger.warn("The example to handle exit signals.");
    },
];

// Define display
const displayStatus = (protocolStatus) => {
    const viewIt = ({protocol, hostname, port}) => {
        // Use logger
        const logger = useLogger();

        // Get node and runtime environment information.
        const nodeEnv = getNodeEnv();
        const runtimeEnv = getRuntimeEnv();
        const instanceMode = getInstanceMode();

        // Display the status
        logger.info(APP_NAME);
        logger.info("====");
        logger.info(`Environment: ${nodeEnv}, ${runtimeEnv}`);
        logger.info(`Instance: ${instanceId}, ${instanceMode}`);
        logger.info(`Protocol "${protocol}" is listening at`);
        logger.info(`${protocol}://${hostname}:${port}`);
    };
    protocolStatus.forEach(viewIt);
};

// Mount application and execute it
invokeApp().
    loadRoutes(routerNames).
    loadInits(initHandlers).
    loadExits(exitHandlers).
    execute().
    then(displayStatus);
