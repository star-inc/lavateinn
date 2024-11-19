// node-cache is an in-memory cache.

// Import modules
import {getMust, isCluster} from "../config.mjs";
import NodeCache from "node-cache";
import Redis from "ioredis";

// Read configuration
const redisUrl = getMust("REDIS_URL");
const redisNamespace = getMust("REDIS_NAMESPACE");

/**
 * Lavateinn Cache.
 * @class Cache
 * The unified cache layer for the application.
 */
class Cache {
    /**
     * The cache type.
     * @type {string}
     */
    type;

    /**
     * The node-cache instance.
     * @type {NodeCache|undefined}
     */
    _nodeCache;

    /**
     * The redis instance.
     * @type {Redis|undefined}
     */
    _redisClient;

    /**
     * The Lavateinn cache instance.
     * @param {Redis|NodeCache} client - The cache client.
     * @throws {Error} If the client is invalid.
     */
    constructor(client) {
        if (client instanceof NodeCache) {
            this.type = "node-cache";
            this._nodeCache = client;
        }
        if (client instanceof Redis) {
            this.type = "redis";
            this._redisClient = client;
        }
        throw new Error("invalid client");
    }

    /**
     * Get a cached value via its key.
     * @param {string} key - The cache key.
     * @returns {any} The cached element.
     * @throws {Error} If the client is invalid.
     */
    get(key) {
        if (this.type === "node-cache") {
            return this._nodeCache.get(key);
        }
        if (this.type === "redis") {
            return this._redisClient.get(key);
        }
        throw new Error("invalid client");
    }

    /**
     * Get multiple cached keys at once.
     * @param {string[]} keys - An array of cache keys.
     * @returns {any[]} An array of cached elements.
     * @throws {Error} If the client is invalid.
     */
    mget(keys) {
        if (this.type === "node-cache") {
            return this._nodeCache.mget(keys);
        }
        if (this.type === "redis") {
            return this._redisClient.mget(keys);
        }
        throw new Error("invalid client");
    }

    /**
     * Set a cached key with the given value.
     * @param {string} key - The cache key.
     * @param {any} value - The value to cache.
     * @param {number} ttl - The time to live for the cache.
     * @returns {boolean} True if the key is set, false otherwise.
     * @throws {Error} If the client is invalid.
     */
    set(key, value, ttl) {
        if (this.type === "node-cache") {
            return this._nodeCache.set(key, value, ttl);
        }
        if (this.type === "redis") {
            return this._redisClient.set(key, value, ttl);
        }
        throw new Error("invalid client");
    }

    /**
     * Set multiple cached keys with the given values.
     * @param {object[]} keyValueSet - An array of object.
     * @returns {boolean} True if all keys are set, false otherwise.
     * @throws {Error} If the client is invalid.
     */
    mset(keyValueSet) {
        if (this.type === "node-cache") {
            return this._nodeCache.mset(keyValueSet);
        }
        if (this.type === "redis") {
            return this._redisClient.mset(keyValueSet);
        }
        throw new Error("invalid client");
    }

    /**
     * Delete a cached values via their keys.
     * @param {string} keys - The cache key.
     * @returns {boolean} True if the key is deleted, false otherwise.
     * @throws {Error} If the client is invalid.
     */
    del(keys) {
        if (this.type === "node-cache") {
            return this._nodeCache.del(keys);
        }
        if (this.type === "redis") {
            return this._redisClient.del(keys);
        }
        throw new Error("invalid client");
    }

    /**
     * Set a key's time to live in seconds.
     * @param {string} key - The cache key.
     * @param {number} ttl - The time to live for the cache.
     * @returns {boolean} True if the key is set, false otherwise.
     * @throws {Error} If the client is invalid.
     */
    ttl(key, ttl) {
        if (this.type === "node-cache") {
            return this._nodeCache.ttl(key, ttl);
        }
        if (this.type === "redis") {
            return this._redisClient.expire(key, ttl);
        }
        throw new Error("invalid client");
    }

    /**
     * Get the time to live (TTL) of a cached value.
     * @param {string} key - The cache key.
     * @returns {number} The TTL in seconds.
     * @throws {Error} If the client is invalid.
     */
    getTTL(key) {
        if (this.type === "node-cache") {
            return this._nodeCache.getTtl(key);
        }
        if (this.type === "redis") {
            return this._redisClient.ttl(key);
        }
        throw new Error("invalid client");
    }

    /**
     * List all keys within this cache
     * @returns {string[]} An array of all keys.
     * @throws {Error} If the client is invalid.
     */
    keys() {
        if (this.type === "node-cache") {
            return this._nodeCache.keys();
        }
        if (this.type === "redis") {
            return this._redisClient.keys("*");
        }
        throw new Error("invalid client");
    }

    /**
     * Get cache statistics.
     * @returns {object[]} An array of cache statistics.
     * @throws {Error} If the client is invalid.
     */
    getStats() {
        if (this.type === "node-cache") {
            return this._nodeCache.getStats();
        }
        if (this.type === "redis") {
            return this._redisClient.server_info;
        }
        throw new Error("invalid client");
    }

    /**
     * Flush the whole data and reset the cache.
     * @returns {boolean} true if the cache is flushed.
     * @throws {Error} If the client is invalid.
     */
    flushAll() {
        if (this.type === "node-cache") {
            return this._nodeCache.flushAll();
        }
        if (this.type === "redis") {
            return this._redisClient.flushall();
        }
        throw new Error("invalid client");
    }

    /**
     * This will clear the interval timeout which is set on checkperiod option.
     * @returns {boolean} true if the cache is cleared and closed.
     * @throws {Error} If the client is invalid.
     */
    close() {
        if (this.type === "node-cache") {
            return this._nodeCache.close();
        }
        if (this.type === "redis") {
            return this._redisClient.quit();
        }
        throw new Error("invalid client");
    }
}

/**
 * Composable cache.
 * @module src/init/cache
 * @returns {NodeCache} The cached node-cache
 */
export function useCache() {
    if (!redisUrl && isCluster()) {
        throw new Error("REDIS_URL is not set but cluster enabled");
    }

    // Determine cache mode (in-memory or redis) based on Redis URL
    const client = redisUrl ?
        new Redis(redisUrl, {
            keyPrefix: redisNamespace,
        }) :
        new NodeCache();

    return new Cache(client);
}
