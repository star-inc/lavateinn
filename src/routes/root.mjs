// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Import instance variables
import {
    instanceId,
} from "../init/instance.mjs";

// Import modules
import {
    useApp,
    StatusCodes,
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
        res.status(StatusCodes.IM_A_TEAPOT).
            send(meetMessage);
    });

    // The handler of heartbeat
    app.get("/heart", (_, res) => {
        res.type("text").
            send(instanceId);
    });

    // The handler for robots.txt (deny all friendly robots)
    app.get("/robots.txt", (_, res) => {
        res.type("text").
            send("User-agent: *\nDisallow: /");
    });
};
