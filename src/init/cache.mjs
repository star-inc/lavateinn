// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// cache-layer is used for as an in-memory cache.

// Import modules
import {get} from "../config.mjs";
import Redis from "ioredis";
import {
    instanceContext,
} from "./instance.mjs";

// Read configuration
const redisUrl = get("REDIS_URL");
const redisNamespace = get("REDIS_NAMESPACE");

/**
 * Lavateinn Cache.
 * @class Cache
 * The unified cache-layer for the application.
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
     * @returns {Redis} The client.
     */
    rawClient() {
        return this._redisClient;
    }

    /**
     * Check if a key exists in the cache.
     * @param {string} key - The cache key.
     * @returns {boolean} True if the key exists, false otherwise.
     */
    has(key) {
        return this._redisClient.exists(key);
    }

    /**
     * Get a cached value via its key.
     * @param {string} key - The cache key.
     * @returns {Promise<any>} The cached element.
     */
    get(key) {
        const value = this._redisClient.get(key);
        return new Promise((resolve) => value.then(
            (v) => resolve(JSON.parse(v)),
        ));
    }

    /**
     * Get multiple cached keys at once.
     * @param {string[]} keys - An array of cache keys.
     * @returns {Promise<any[]>} An array of cached elements.
     */
    mget(keys) {
        const keyValueSet = this._redisClient.mget(keys);
        return keyValueSet.map(JSON.parse);
    }

    /**
     * Set a cached key with the given value.
     * @param {string} key - The cache key.
     * @param {any} value - The value to cache.
     * @param {number} ttl - The time to live for the cache.
     * @returns {Promise<boolean>} True if the key is set, false otherwise.
     */
    set(key, value, ttl) {
        value = JSON.stringify(value);
        return this._redisClient.setex(key, ttl, value);
    }

    /**
     * Set multiple cached keys with the given values.
     * @param {object[]} keyValueSet - An array of object.
     * @returns {Promise<boolean>} True if all keys are set, false otherwise.
     */
    mset(keyValueSet) {
        keyValueSet = keyValueSet.map(JSON.stringify);
        return this._redisClient.mset(keyValueSet);
    }

    /**
     * Delete a cached values via their keys.
     * @param {string} keys - The cache key.
     * @returns {Promise<boolean>} True if the key is deleted, false otherwise.
     */
    del(keys) {
        return this._redisClient.del(keys);
    }

    /**
     * Set a key's time to live in seconds.
     * @param {string} key - The cache key.
     * @param {number} ttl - The time to live for the cache.
     * @returns {Promise<boolean>} True if the key is set, false otherwise.
     */
    ttl(key, ttl) {
        return this._redisClient.expire(key, ttl);
    }

    /**
     * Get the time to live (TTL) of a cached value.
     * @param {string} key - The cache key.
     * @returns {Promise<number>} The TTL in seconds.
     */
    getTTL(key) {
        return this._redisClient.ttl(key);
    }

    /**
     * List all keys within this cache
     * @returns {Promise<string[]>} An array of all keys.
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
     * @returns {Promise<boolean>} true if the cache is flushed.
     */
    flushAll() {
        return this._redisClient.flushall();
    }

    /**
     * This will clear the interval timeout which is set on checkperiod option.
     * @returns {Promise<boolean>} true if the cache is cleared and closed.
     */
    close() {
        return this._redisClient.quit();
    }
}

/**
 * Composable cache.
 * @module src/init/cache
 * @returns {Cache} The cache-layer
 */
export function useCache() {
    // Return the existing instance if exists
    if (instanceContext.has("Cache")) {
        return instanceContext.get("Cache");
    }

    // Construct the Redis client
    const client = new Redis(redisUrl, {
        keyPrefix: `${redisNamespace}:`,
    });

    // Construct the cache-layer
    const cache = new Cache(client);
    instanceContext.set("Cache", cache);
    return cache;
}
