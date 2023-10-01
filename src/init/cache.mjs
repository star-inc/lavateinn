"use strict";
// node-cache is an in-memory cache.

// Import node-cache
import NodeCache from "node-cache";

// Initialize node-cache
const cache = new NodeCache({stdTTL: 100});

// Export as a function named useCache
export const useCache = () => cache;
