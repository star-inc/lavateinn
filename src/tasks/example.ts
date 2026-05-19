// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

import {
    useLogger,
} from "../init/logger.ts";

export default (date: Date): void => {
    const logger = useLogger();
    logger.info(`Scheduler Example: ${date}`);
};
