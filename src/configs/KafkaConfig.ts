import { config } from "dotenv";

import { PREFIX } from "./AppConfig";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

const environment = process.env;

export const KAFKA_HOST_MICROSERVICES = environment.KAFKA_HOST_MICROSERVICES || "localhost:9092";
export const PRODUCE_EVENTS = environment.KAFKA_PRODUCE_EVENTS === "true";
export const CONSUME_EVENTS = environment.KAFKA_CONSUME_EVENTS === "true";
export const KAFKA_COMPRESSION_CODEC = environment.KAFKA_COMPRESSION_CODEC || "gzip";
export const KAFKA_RETRY_BACKOFF_MS = Number(environment.KAFKA_RETRY_BACKOFF_MS) || 200;
export const KAFKA_SEND_MAX_RETRIES = Number(environment.KAFKA_SEND_MAX_RETRIES) || 10;
export const KAFKA_SOCKET_KEEP_ALIVE = environment.KAFKA_SOCKET_KEEP_ALIVE;
export const KAFKA_BUFFERING_MAX_MESSAGES = Number(environment.KAFKA_BUFFERING_MAX_MESSAGES) || 100000;
export const KAFKA_BUFFERING_MAX_MS = Number(environment.KAFKA_BUFFERING_MAX_MS) || 1000;
export const KAFKA_ENABLE_DELIVERY_REPORT = environment.KAFKA_ENABLE_DELIVERY_REPORT;

const clientConfig = {
  "metadata.broker.list": KAFKA_HOST_MICROSERVICES,
  "client.id": `apart-${PREFIX}`,
  "compression.codec": KAFKA_COMPRESSION_CODEC,
  "retry.backoff.ms": KAFKA_RETRY_BACKOFF_MS,
  "message.send.max.retries": KAFKA_SEND_MAX_RETRIES,
  "socket.keepalive.enable": Boolean(KAFKA_SOCKET_KEEP_ALIVE) || true,
  "queue.buffering.max.messages": KAFKA_BUFFERING_MAX_MESSAGES,
  "queue.buffering.max.ms": KAFKA_BUFFERING_MAX_MS,
};

const CREATED = "added";
const UPDATED = "updated";
const DELETED = "deleted";

// PRODUCER CONFIGS
export const TOPIC_PREFIX = environment.KAFKA_TOPIC_PREFIX || `apart-${PREFIX}`;
export const PRODUCER_POLL_INTERVAL = Number(environment.PRODUCER_POLL_INTERVAL) || 100;

export const producerConfig = {
  enabled: PRODUCE_EVENTS,
  prefix: TOPIC_PREFIX,
  producerPollInterval: PRODUCER_POLL_INTERVAL,
  dr_cb: Boolean(KAFKA_ENABLE_DELIVERY_REPORT) || true,
  ...clientConfig,
};

const events = {
  ACCOUNT: "account",
};

export const AccountConfig = {
  topic: events.ACCOUNT,
  updatedEvent: `${events.ACCOUNT}_${UPDATED}`,
  createdEvent: `${events.ACCOUNT}_${CREATED}`,
  deletedEvent: `${events.ACCOUNT}_${DELETED}`,
};
