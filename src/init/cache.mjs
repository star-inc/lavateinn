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
     */
    constructor(client) {
        this._redisClient = client;
    }

    /**
     * Get the raw ioredis client.
     * @returns {any} The client.
     */
    rawClient() {
        return this._redisClient;
    }

    /**
     * Get a cached value via its key.
     * @param {string} key - The cache key.
     * @returns {any} The cached element.
     */
    get(key) {
        return this._redisClient.get(key);
    }

    /**
     * Get multiple cached keys at once.
     * @param {string[]} keys - An array of cache keys.
     * @returns {any[]} An array of cached elements.
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
     */
    set(key, value, ttl) {
        return this._redisClient.set(key, value, ttl);
    }

    /**
     * Set multiple cached keys with the given values.
     * @param {object[]} keyValueSet - An array of object.
     * @returns {boolean} True if all keys are set, false otherwise.
     */
    mset(keyValueSet) {
        return this._redisClient.mset(keyValueSet);
    }

    /**
     * Delete a cached values via their keys.
     * @param {string} keys - The cache key.
     * @returns {boolean} True if the key is deleted, false otherwise.
     */
    del(keys) {
        return this._redisClient.del(keys);
    }

    /**
     * Set a key's time to live in seconds.
     * @param {string} key - The cache key.
     * @param {number} ttl - The time to live for the cache.
     * @returns {boolean} True if the key is set, false otherwise.
     */
    ttl(key, ttl) {
        return this._redisClient.expire(key, ttl);
    }

    /**
     * Get the time to live (TTL) of a cached value.
     * @param {string} key - The cache key.
     * @returns {number} The TTL in seconds.
     */
    getTTL(key) {
        return this._redisClient.ttl(key);
    }

    /**
     * List all keys within this cache
     * @returns {string[]} An array of all keys.
     */
    keys() {
        return this._redisClient.keys("*");
    }

    /**
     * Get cache statistics.
     * @returns {object[]} An array of cache statistics.
     */
    getStats() {
        return this._redisClient.server_info;
    }

    /**
     * Flush the whole data and reset the cache.
     * @returns {boolean} true if the cache is flushed.
     */
    flushAll() {
        return this._redisClient.flushall();
    }

    /**
     * This will clear the interval timeout which is set on checkperiod option.
     * @returns {boolean} true if the cache is cleared and closed.
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
    // Construct the Redis client
    const client = new Redis(redisUrl, {
        keyPrefix: redisNamespace,
    });

    // Construct the cache layer
    return new Cache(client);
}
