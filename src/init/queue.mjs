// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// queue-layer is used for delivering messages between services.

// Import modules
import {get, getEnabled} from "../config.mjs";
import amqp from "amqplib";

import {
    instanceId,
    instanceContext,
} from "./instance.mjs";

// Read configuration
const amqpUrl = get("AMPQ_URL");
const amqpDurable = getEnabled("AMPQ_DURABLE");

/**
 * Lavateinn Queue.
 * @class Queue
 * The unified queue-layer for the application.
 */
class Queue {
    /**
     * The amqp instance.
     * @type {amqp.Connection|undefined}
     */
    _amqpClient;

    /**
     * The amqp channel instance.
     * @type {amqp.Channel|undefined}
     */
    _channel;

    /**
     * The Lavateinn queue instance.
     * @param {amqp.Connection} client - The queue client.
     * @param {amqp.Channel} channel - The queue channel.
     */
    constructor(client, channel) {
        this._amqpClient = client;
        this._channel = channel;
    }

    /**
     * Get the raw amqplib client.
     * @returns {amqp.Connection} The client.
     */
    rawClient() {
        return this._amqpClient;
    }

    /**
     * Get the raw amqplib channel.
     * @returns {amqp.Channel} The channel.
     */
    rawChannel() {
        return this._channel;
    }

    /**
     * @callback SubscribeCallback
     * @param {amqp.ConsumeMessage} message - The message.
     * @returns {void}
     */

    /**
     * Subscribe to a topic.
     * @param {string} topic - The topic to subscribe.
     * @param {SubscribeCallback} callback - The callback function.
     * @returns {void}
     */
    subscribe(topic, callback) {
        this._channel.assertQueue(topic, {durable: amqpDurable});
        this._channel.consume(topic, callback, {noAck: true});
    }

    /**
     * Receive a message from a topic.
     * @param {string} topic - The topic to receive.
     * @param {SubscribeCallback} callback - The callback function.
     * @returns {void}
     */
    receive(topic, callback) {
        this._channel.assertQueue(topic, {durable: amqpDurable});
        this._channel.consume(topic, callback, {noAck: false});
    }

    /**
     * Deliver a message to a topic.
     * @param {string} topic - The topic to send.
     * @param {Buffer} content - The content to send.
     * @returns {void}
     */
    deliver(topic, content) {
        const correlationId = instanceId;
        this._channel.assertQueue(topic, {durable: amqpDurable});
        this._channel.sendToQueue(topic, content, {correlationId});
    }

    /**
     * Close the queue-layer.
     * @returns {Promise<void>}
     */
    close() {
        return this._amqpClient.close();
    }
}

/**
 * Composable Queue.
 * @module src/init/queue
 * @returns {Promise<Queue>} The queue-layer
 */
export async function useQueue() {
    // Return the existing instance if exists
    if (instanceContext.has("Queue")) {
        return instanceContext.get("Queue");
    }

    // Construct the amqp client
    const client = await amqp.connect(amqpUrl);

    // Create the channel
    const channel = await client.createChannel();

    // Construct the queue-layer
    const queue = new Queue(client, channel);
    instanceContext.set("Queue", queue);
    return queue;
}
