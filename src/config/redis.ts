import Redis from "ioredis";
import { config } from "./config";
import logger from "./logger";

const isTest = config.server.nodeEnv === "test";

/**
 * Create Redis client based on environment:
 * - Test: Uses ioredis-mock (in-memory)
 * - Production (Upstash): Uses REDIS_URL (rediss:// auto-enables TLS)
 * - Development (Docker): Uses REDIS_HOST and REDIS_PORT
 */
function createRedisClient(): Redis {
  if (isTest) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const RedisMock = require("ioredis-mock");
    return new RedisMock();
  }

  let client: Redis;

  // If REDIS_URL is provided (Upstash/managed Redis), use it
  // ioredis automatically enables TLS when URL starts with "rediss://"
  if (config.redis.url) {
    client = new Redis(config.redis.url, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
    });
    logger.info("Using managed Redis (REDIS_URL)");
  } else {
    // Local Docker Redis
    client = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
    });
    logger.info(
      `Using local Redis (${config.redis.host}:${config.redis.port})`
    );
  }

  client.on("connect", () => logger.info("Redis connected"));
  client.on("error", (err) => logger.error("Redis error:", err));
  client.on("close", () => logger.warn("Redis connection closed"));

  return client;
}

/**
 * BullMQ connection options
 * - Upstash: Uses REDIS_URL (rediss:// auto-enables TLS)
 * - Local: Uses HOST/PORT
 */
export const bullmqConnection = isTest
  ? { host: "localhost", port: 6379, maxRetriesPerRequest: null }
  : config.redis.url
  ? {
      // Upstash connection for BullMQ
      connection: new Redis(config.redis.url, {
        maxRetriesPerRequest: null,
      }),
    }
  : {
      // Local Docker Redis for BullMQ
      host: config.redis.host,
      port: config.redis.port,
      maxRetriesPerRequest: null,
    };

const redis = createRedisClient();

export default redis;
