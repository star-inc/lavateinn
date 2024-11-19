// Auto-load config
import "./src/init/config.mjs";

// Import constants
import {
    APP_NAME,
} from "./src/init/const.mjs";

// Import modules
import {
    getNodeEnv,
    getRuntimeEnv,
    getInstanceMode,
} from "./src/config.mjs";
import {
    instanceId,
    invokeApp,
} from "./src/execute.mjs";

import {
    useLogger,
} from "./src/init/logger.mjs";

import {
    exitHandler as tempExitHandler,
} from "./src/init/temp.mjs";

// Define plugin promises
const pluginPromises = [
    new Promise((resolve) => {
        const logger = useLogger();
        logger.warn("The example to wait the plugin promise.");
        setTimeout(resolve, 3000);
    }),
];

// Define router names
const routerNames = [
    "root",
    "example",
];

// Define exit handlers
const exitHandlers = [
    tempExitHandler,
    () => {
        const logger = useLogger();
        logger.info("The example to handle exit signals.");
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
        logger.info(`Environment: ${nodeEnv}, ${runtimeEnv})`);
        logger.info(`Instance: ${instanceId}, ${instanceMode}`);
        logger.info(`Protocol "${protocol}" is listening at`);
        logger.info(`${protocol}://${hostname}:${port}`);
    };
    protocolStatus.forEach(viewIt);
};

// Mount application and execute it
invokeApp().
    loadPromises(pluginPromises).
    loadRoutes(routerNames).
    loadExits(exitHandlers).
    execute().
    then(displayStatus);
