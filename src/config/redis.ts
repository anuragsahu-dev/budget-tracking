import Redis from "ioredis";
import { config } from "./config";
import logger from "./logger";

const isTest = process.env.NODE_ENV === "test";

// Create Redis client based on environment
function createRedisClient(): Redis {
  if (isTest) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const RedisMock = require("ioredis-mock");
    return new RedisMock();
  }

  const client = new Redis({
    host: config.redis.host,
    port: config.redis.port,
  });

  client.on("connect", () => logger.info("Redis connected"));
  client.on("error", (err) => logger.error("Redis error:", err));

  return client;
}

// BullMQ connection options (requires maxRetriesPerRequest: null)
export const bullmqConnection = isTest
  ? { host: "localhost", port: 6379, maxRetriesPerRequest: null }
  : {
      host: config.redis.host,
      port: config.redis.port,
      maxRetriesPerRequest: null,
    };

const redis = createRedisClient();

export default redis;
