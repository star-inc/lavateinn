// Import modules
import {
    StatusCodes,
} from "http-status-codes";

import {
    useApp,
} from "../init/express.mjs";

// Export routes mapper (function)
export default () => {
    // Use application
    const app = useApp();

    // API Index Message
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
};
