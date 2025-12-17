import Redis from "ioredis";
import { config } from "./config";
import logger from "./logger";

/**
 * Main Redis connection for caching and general use
 */
const redis = new Redis({
  port: config.redis.port,
  host: config.redis.host,
});

redis.on("connect", () => logger.info("Redis connected"));
redis.on("error", (err) => logger.error("Redis error:", err));

/**
 * Redis connection options for BullMQ
 * BullMQ requires maxRetriesPerRequest: null because it uses blocking commands
 */
export const bullmqConnection = {
  host: config.redis.host,
  port: config.redis.port,
  maxRetriesPerRequest: null,
};

export default redis;
