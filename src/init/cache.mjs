// node-cache is an in-memory cache.

// Import modules
import NodeCache from "node-cache";

// Initialize node-cache
const cache = new NodeCache({
    stdTTL: 100,
});

/**
 * Composable cache.
 * @module src/init/cache
 * @returns {NodeCache} The cached node-cache
 */
export function useCache() {
    return cache;
}
