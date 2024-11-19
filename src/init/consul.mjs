// consul is a microservice registry and health check tool.

// Import constants
import {
    APP_NAME,
} from "./const.mjs";

// Import instance variables
import {
    instanceId,
    instanceUrl,
} from "./instance.mjs";

// Import modules
import Consul from "consul";

import {
    getMust,
    isCluster,
} from "../config.mjs";

// Read configuration
const consulUrl = getMust("CONSUL_URL");

/**
 * Initialize the consul.
 */
export const initHandler = async () => {
    // If consul URL is not specified, skip
    if (!consulUrl || !isCluster()) return;

    // Use consul
    const client = useConsul();

    // Register the service to consul
    const url = new URL(instanceUrl);
    client.agent.service.register({
        id: instanceId,
        name: APP_NAME,
        address: url.hostname,
        port: url.port || 80,
        check: {
            http: `${instanceUrl}/heart`,
            interval: "10s",
            timeout: "5s",
        },
    });
};

/**
 * The exit handler to clean up temporary files and directories.
 * @returns {void}
 */
export async function exitHandler() {
    const client = useConsul();
    await client.agent.service.deregister(instanceId);
}

/**
 * Composable Consul.
 * @returns {Consul} The consul instance.
 */
export function useConsul() {
    return new Consul();
}
