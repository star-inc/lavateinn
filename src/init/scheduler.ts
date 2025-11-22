// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// node-schedule is a flexible cron-like and not-cron-like job scheduler.

// Import modules
import schedule from "node-schedule";
import {
    instanceContext,
} from "./instance.ts";

type TaskModule = {
    default: (date: Date, options: Record<string, unknown>) => void;
};

/**
 * Create the task callback by its name.
 * @param name - The task name.
 * @param options - The task options.
 * @returns The callback function.
 */
function createTaskCallback(
    name: string,
    options: Record<string, unknown> = {},
) {
    const methodDirectory = new URL("../tasks/", import.meta.url);
    const methodFilename = `${methodDirectory.href}${name}.ts`;

    return async (date: Date) => {
        const module = await import(methodFilename) as TaskModule;
        module.default(date, options);
    };
}

/**
 * Add a schedule task.
 * @param time - The task time.
 * @param name - The task name.
 * @param options - The task options.
 */
export function addTask(
    time: string,
    name: string,
    options: Record<string, unknown> = {},
): void {
    const callback = createTaskCallback(name, options);
    schedule.scheduleJob(time, callback);
}

/**
 * Add a schedule task and run immediately.
 * @param time - The task time.
 * @param name - The task name.
 * @param options - The task options.
 */
export function addInitTask(
    time: string,
    name: string,
    options: Record<string, unknown> = {},
): void {
    const callback = createTaskCallback(name, options);
    schedule.scheduleJob(time, callback);
    callback(new Date());
}

/**
 * Composable scheduler.
 * @returns The logger.
 */
export function useScheduler() {
    // Return the existing instance if exists
    if (instanceContext.has("Scheduler")) {
        return instanceContext.get("Scheduler");
    }

    // Return the scheduler
    instanceContext.set("Scheduler", schedule);
    return schedule;
}
