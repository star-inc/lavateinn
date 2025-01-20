// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// node-schedule is a flexible cron-like and not-cron-like job scheduler.

// Import modules
import schedule from "node-schedule";

/**
 * @callback TaskCallback
 * @param {Date} date - The date.
 * @returns {void}
 */

/**
 * Create the task callback by its name.
 * @module src/init/scheduler
 * @param {string} name - The task name.
 * @param {object} [options] - The task options.
 * @returns {TaskCallback} The callback function.
 */
function createTaskCallback(name, options) {
    const methodDirectory = new URL("../tasks/", import.meta.url);
    const methodFilename = new URL(`${name}.mjs`, methodDirectory);

    return async (date) => {
        const module = await import(methodFilename);
        module.default(date, options);
    };
}

/**
 * Add a schedule task.
 * @module src/init/scheduler
 * @param {string} time - The task time.
 * @param {string} name - The task name.
 * @param {object} [options] - The task options.
 * @returns {void}
 */
export function addTask(time, name, options = {}) {
    const callback = createTaskCallback(name, options);
    schedule.scheduleJob(time, callback);
}

/**
 * Add a schedule task and run immediately.
 * @module src/init/scheduler
 * @param {string} time - The task time.
 * @param {string} name - The task name.
 * @param {object} [options] - The task options.
 * @returns {void}
 */
export function addInitTask(time, name, options = {}) {
    const callback = createTaskCallback(name, options);
    schedule.scheduleJob(time, callback);
    callback(new Date());
}

/**
 * Composable scheduler.
 * @module src/init/scheduler
 * @returns {schedule} The logger.
 */
export function useScheduler() {
    return schedule;
}
