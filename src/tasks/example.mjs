// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

import {
    useLogger,
} from "../init/logger.mjs";

export default (date) => {
    const logger = useLogger();
    logger.info(`Scheduler Example: ${date}`);
};
