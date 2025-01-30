// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// define application instance variables here.
// to be used for identity in clusters.

// Import constants
import {
    APP_NAME,
} from "./const.mjs";

// Import modules
import process from "node:process";
import cluster from "node:cluster";
import events from "node:events";
import os from "node:os";

import {
    nanoid,
} from "nanoid";

import {
    isCluster,
    get,
} from "../config.mjs";

// Define instance id
export const instanceId = `${APP_NAME}#${nanoid()}`;

// Define instance http url (aka. canonical url)
export const instanceUrl = get("INSTANCE_URL");

// Define instance role (single, primary or worker)
export const instanceRole = isCluster() ? (
    cluster.isPrimary ? "primary" : "worker"
) : "single";

// Define instance context
export const instanceContext = new Map();

// Define message listener
const messageBox = new events.EventEmitter();

/**
 * @callback MessageListener
 * @param {...any} args - The message arguments.
 * @returns {void}
 */

/**
 * Register message listener.
 * @module src/init/instance
 * @param {string} type - The message type.
 * @param {MessageListener} listener - The message listener.
 * @returns {void}
 */
export function onMessage(type, listener) {
    messageBox.on(type, listener);
}

/**
 * Send message to other instances.
 * @module src/init/instance
 * @param {string} type - The message type.
 * @param  {object} payload - The message payload.
 * @returns {object} The message.
 */
export function toMessage(type, payload) {
    return {type, ...payload};
}

/**
 * Setup cluster mode for primary instance.
 * @module src/init/instance
 * @returns {void}
 */
export function setupClusterPrimary() {
    // Listen messages from workers
    cluster.on("message", (worker, message) => {
        messageBox.emit(message.type, message, worker);
    });

    // Handle worker startup
    messageBox.on("startup", (message, worker) => {
        const contextKey = `worker#${worker.id}`;
        instanceContext.set(contextKey, message.instanceId);
        const primaryId = instanceId;
        const workerId = worker.id;
        worker.send(toMessage(
            "startup", {primaryId, workerId},
        ));
    });

    // Handle worker exit
    cluster.on("exit", (worker, code, signal) => {
        console.warn(
            `Cluster worker ${worker.process.pid} exits ` +
            `with code ${code} and signal ${signal}`,
        );
    });

    // Fork workers
    const forkCount = os.availableParallelism();
    for (let i = 0; i < forkCount; i++) {
        cluster.fork();
    }
}

/**
 * Setup cluster mode for worker instance.
 * @module src/init/instance
 * @returns {Promise<void>} A promise that resolves when setup completed.
 */
export function setupClusterWorker() {
    // Listen messages from primary
    process.on("message", (message) => {
        messageBox.emit(message.type, message);
    });

    // Emit startup signal
    process.send(toMessage(
        "startup", {instanceId},
    ));

    // Wait for startup signal
    return new Promise((resolve) => {
        messageBox.on("startup", (message) => {
            instanceContext.set(
                "primaryId", message.primaryId,
            );
            instanceContext.set(
                "workerId", message.workerId,
            );
            resolve();
        });
    });
}
