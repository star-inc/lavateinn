// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// cache-layer is used for as an in-memory cache.

// Import modules
import {get} from "../config.ts";
import {Redis} from "ioredis";
import {
    instanceContext,
} from "./instance.ts";

interface RedisWithServerInfo extends Redis {
    server_info?: string;
}

// Read configuration
const redisUrl = get("REDIS_URL");
const redisNamespace = get("REDIS_NAMESPACE");

/**
 * Lavateinn Cache.
 * Cache
 * The unified cache-layer for the application.
 */
class Cache {
    /**
     * The redis instance.
     */
    private _redisClient: Redis;

    /**
     * The Lavateinn cache instance.
     * @param client - The cache client.
     */
    constructor(client: Redis) {
        this._redisClient = client;
    }

    /**
     * Get the raw ioredis client.
     * @returns The client.
     */
    rawClient(): Redis {
        return this._redisClient;
    }

    /**
     * Check if a key exists in the cache.
     * @param key - The cache key.
     * @returns True if the key exists, false otherwise.
     */
    has(key: string): Promise<number> {
        return this._redisClient.exists(key);
    }

    /**
     * Get a cached value via its key.
     * @param key - The cache key.
     * @returns The cached element.
     */
    async get<T>(key: string): Promise<T | null> {
        const value = await this._redisClient.get(key);
        if (value === null) {
            return null;
        }
        return JSON.parse(value) as T;
    }

    /**
     * Get multiple cached keys at once.
     * @param keys - An array of cache keys.
     * @returns An array of cached elements.
     */
    async mget<T>(keys: string[]): Promise<(T | null)[]> {
        const values = await this._redisClient.mget(keys);
        return values.map((v) => (v === null ? null : (JSON.parse(v) as T)));
    }

    /**
     * Set a cached key with the given value.
     * @param key - The cache key.
     * @param value - The value to cache.
     * @param ttl - The time to live for the cache.
     * @returns True if the key is set, false otherwise.
     */
    set(key: string, value: any, ttl: number): Promise<"OK"> {
        const valueStr = JSON.stringify(value);
        return this._redisClient.setex(key, ttl, valueStr);
    }

    /**
     * Set multiple cached keys with the given values.
     * @param keyValueSet - An object representing keys and values.
     * @returns True if all keys are set, false otherwise.
     */
    mset(keyValueSet: Record<string, any>): Promise<"OK"> {
        const stringifiedMap: Record<string, string> = {};
        for (const [key, value] of Object.entries(keyValueSet)) {
            stringifiedMap[key] = JSON.stringify(value);
        }
        return this._redisClient.mset(stringifiedMap);
    }

    /**
     * Delete a cached values via their keys.
     * @param keys - The cache key.
     * @returns True if the key is deleted, false otherwise.
     */
    del(keys: string | string[]): Promise<number> {
        if (Array.isArray(keys)) {
            return this._redisClient.del(...keys);
        }
        return this._redisClient.del(keys);
    }

    /**
     * Set a key's time to live in seconds.
     * @param key - The cache key.
     * @param ttl - The time to live for the cache.
     * @returns True if the key is set, false otherwise.
     */
    ttl(key: string, ttl: number): Promise<number> {
        return this._redisClient.expire(key, ttl);
    }

    /**
     * Get the time to live (TTL) of a cached value.
     * @param key - The cache key.
     * @returns The TTL in seconds.
     */
    getTTL(key: string): Promise<number> {
        return this._redisClient.ttl(key);
    }

    /**
     * List all keys within this cache
     * @returns An array of all keys.
     */
    keys(): Promise<string[]> {
        return this._redisClient.keys("*");
    }

    /**
     * Get cache statistics.
     * @returns An array of cache statistics.
     */
    getStats(): string {
        return (this._redisClient as RedisWithServerInfo).server_info || "";
    }

    /**
     * Flush the whole data and reset the cache.
     * @returns true if the cache is flushed.
     */
    flushAll(): Promise<"OK"> {
        return this._redisClient.flushall();
    }

    /**
     * This will clear the interval timeout which is set on checkperiod option.
     * @returns true if the cache is cleared and closed.
     */
    close(): Promise<"OK" | undefined> {
        return this._redisClient.quit();
    }
}

/**
 * Composable cache.
 * @returns The cache-layer
 */
export function useCache(): Cache {
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
