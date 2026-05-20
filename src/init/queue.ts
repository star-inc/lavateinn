// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// queue-layer is used for delivering messages between services.

// Import modules
import {get, getEnabled} from "../config.ts";
import amqp from "amqplib";

import {
    instanceContext,
    instanceId,
} from "./instance.ts";

// Read configuration
const amqpUrl = get("AMPQ_URL");
const amqpDurable = getEnabled("AMPQ_DURABLE");

/**
 * Lavateinn Queue.
 * The unified queue-layer for the application.
 */
class Queue {
    /**
     * The amqp instance.
     */
    private _amqpClient: amqp.ChannelModel;

    /**
     * The amqp channel instance.
     */
    private _channel: amqp.Channel;

    /**
     * The Lavateinn queue instance.
     * @param client - The queue client.
     * @param channel - The queue channel.
     */
    constructor(client: amqp.ChannelModel, channel: amqp.Channel) {
        this._amqpClient = client;
        this._channel = channel;
    }

    /**
     * Get the raw amqplib client.
     * @returns The client.
     */
    rawClient(): amqp.ChannelModel {
        return this._amqpClient;
    }

    /**
     * Get the raw amqplib channel.
     * @returns The channel.
     */
    rawChannel(): amqp.Channel {
        return this._channel;
    }

    /**
     * Subscribe to a topic.
     * @param topic - The topic to subscribe.
     * @param callback - The callback function.
     */
    subscribe(
        topic: string,
        callback: (
            message: amqp.ConsumeMessage | null,
            channel: amqp.Channel,
        ) => void,
    ): void {
        this._channel.assertQueue(topic, {durable: amqpDurable});
        this._channel.consume(topic, (message: amqp.ConsumeMessage | null) => {
            callback(message, this._channel);
        }, {noAck: true});
    }

    /**
     * Receive a message from a topic.
     * @param topic - The topic to receive.
     * @param callback - The callback function.
     */
    receive(
        topic: string,
        callback: (
            message: amqp.ConsumeMessage | null,
            channel: amqp.Channel,
        ) => void,
    ): void {
        this._channel.assertQueue(topic, {durable: amqpDurable});
        this._channel.consume(topic, (message: amqp.ConsumeMessage | null) => {
            callback(message, this._channel);
        }, {noAck: false});
    }

    /**
     * Deliver a message to a topic.
     * @param topic - The topic to send.
     * @param content - The content to send.
     */
    deliver(topic: string, content: Buffer): void {
        const correlationId = instanceId;
        this._channel.assertQueue(topic, {durable: amqpDurable});
        this._channel.sendToQueue(topic, content, {correlationId});
    }

    /**
     * Close the queue-layer.
     * @returns Promise that resolves when closed.
     */
    close(): Promise<void> {
        return this._amqpClient.close();
    }
}

/**
 * Composable Queue.
 * @returns The queue-layer
 */
export async function useQueue(): Promise<Queue> {
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
