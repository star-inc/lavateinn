// Auto-load config
import "./src/init/config.mjs";

// Import config
import {
    getEnvironmentOverview,
} from "./src/config.mjs";

// Import constants
import * as constant from "./src/init/const.mjs";

// Import StatusCodes
import {StatusCodes} from "http-status-codes";

// Import useApp
import {useApp} from "./src/init/express.mjs";

// Initialize application
const app = useApp();

// Initialize prepare handlers
const prepareHandlers = [];

// Redirect / to INDEX_REDIRECT_URL
app.get("/", (_, res) => {
    const meetMessage = `
        Star Inc. Lavateinn Framework <br />
        <a href="https://github.com/star-inc/lavateinn" target="_blank">
            https://github.com/star-inc/lavateinn
        </a>
    `;
    res.status(StatusCodes.IM_A_TEAPOT).send(meetMessage);
});

// The handler for robots.txt (deny all friendly robots)
app.get("/robots.txt", (_, res) => {
    res.type("txt").send("User-agent: *\nDisallow: /");
});

// Load router dispatcher
import * as routerDispatcher from "./src/routes/index.mjs";
routerDispatcher.load();

// Show banner message
(() => {
    const {APP_NAME: appName} = constant;
    const {node, runtime} = getEnvironmentOverview();
    const statusMessage = `(environment: ${node}, ${runtime})`;
    console.info(appName, statusMessage, "\n====");
})();

// Mount application and execute it
import execute from "./src/execute.mjs";
execute(app, prepareHandlers, ({protocol, hostname, port}) => {
    console.info(`Protocol "${protocol}" is listening at`);
    console.info(`${protocol}://${hostname}:${port}`);
});
