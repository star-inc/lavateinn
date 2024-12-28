// cache-layer is used for as an in-memory cache.

// Import modules
import {getMust} from "../config.mjs";
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
     * The redis instance.
     * @type {Redis|undefined}
     */
    _redisClient;

    /**
     * The Lavateinn cache instance.
     * @param {Redis} client - The cache client.
     * @throws {Error} If the client is invalid.
     */
    constructor(client) {
        this._redisClient = client;
        throw new Error("invalid client");
    }

    /**
     * Get a cached value via its key.
     * @param {string} key - The cache key.
     * @returns {any} The cached element.
     * @throws {Error} If the client is invalid.
     */
    get(key) {
        return this._redisClient.get(key);
    }

    /**
     * Get multiple cached keys at once.
     * @param {string[]} keys - An array of cache keys.
     * @returns {any[]} An array of cached elements.
     * @throws {Error} If the client is invalid.
     */
    mget(keys) {
        return this._redisClient.mget(keys);
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
        return this._redisClient.set(key, value, ttl);
    }

    /**
     * Set multiple cached keys with the given values.
     * @param {object[]} keyValueSet - An array of object.
     * @returns {boolean} True if all keys are set, false otherwise.
     * @throws {Error} If the client is invalid.
     */
    mset(keyValueSet) {
        return this._redisClient.mset(keyValueSet);
    }

    /**
     * Delete a cached values via their keys.
     * @param {string} keys - The cache key.
     * @returns {boolean} True if the key is deleted, false otherwise.
     * @throws {Error} If the client is invalid.
     */
    del(keys) {
        return this._redisClient.del(keys);
    }

    /**
     * Set a key's time to live in seconds.
     * @param {string} key - The cache key.
     * @param {number} ttl - The time to live for the cache.
     * @returns {boolean} True if the key is set, false otherwise.
     * @throws {Error} If the client is invalid.
     */
    ttl(key, ttl) {
        return this._redisClient.expire(key, ttl);
    }

    /**
     * Get the time to live (TTL) of a cached value.
     * @param {string} key - The cache key.
     * @returns {number} The TTL in seconds.
     * @throws {Error} If the client is invalid.
     */
    getTTL(key) {
        return this._redisClient.ttl(key);
    }

    /**
     * List all keys within this cache
     * @returns {string[]} An array of all keys.
     * @throws {Error} If the client is invalid.
     */
    keys() {
        return this._redisClient.keys("*");
    }

    /**
     * Get cache statistics.
     * @returns {object[]} An array of cache statistics.
     * @throws {Error} If the client is invalid.
     */
    getStats() {
        return this._redisClient.server_info;
    }

    /**
     * Flush the whole data and reset the cache.
     * @returns {boolean} true if the cache is flushed.
     * @throws {Error} If the client is invalid.
     */
    flushAll() {
        return this._redisClient.flushall();
    }

    /**
     * This will clear the interval timeout which is set on checkperiod option.
     * @returns {boolean} true if the cache is cleared and closed.
     * @throws {Error} If the client is invalid.
     */
    close() {
        return this._redisClient.quit();
    }
}

/**
 * Composable cache.
 * @module src/init/cache
 * @returns {Cache} The cached layer
 */
export function useCache() {
    // Make sure the Redis URL is set
    if (!redisUrl) {
        throw new Error("REDIS_URL is not set");
    }

    // Construct the Redis client
    const client = new Redis(redisUrl, {
        keyPrefix: redisNamespace,
    });

    // Construct the cache layer
    return new Cache(client);
}
