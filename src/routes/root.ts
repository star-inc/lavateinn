// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

import type {Context} from "hono";
import type {StatusCode} from "hono/utils/http-status";
import type {HonoEnv} from "../types/hono.ts";

// Import instance variables
import {
    instanceId,
} from "../init/instance.ts";

// Import modules
import {
    StatusCodes,
    useApp,
} from "../init/hono.ts";

// Export routes mapper (function)
export default (): void => {
    // Use application
    const app = useApp();

    // API Index Message
    app.get("/", (c: Context<HonoEnv>) => {
        const meetMessage = `
        Star Inc. Lavateinn Framework <br />
        <a href="https://github.com/star-inc/lavateinn" target="_blank">
            https://github.com/star-inc/lavateinn
        </a>
        `;
        c.status(StatusCodes.IM_A_TEAPOT as StatusCode);
        return c.html(meetMessage);
    });

    // The handler of heartbeat
    app.get("/heart", (c: Context<HonoEnv>) => {
        return c.text(instanceId);
    });

    // The handler for robots.txt (deny all friendly robots)
    app.get("/robots.txt", (c: Context<HonoEnv>) => {
        return c.text("User-agent: *\nDisallow: /");
    });
};
