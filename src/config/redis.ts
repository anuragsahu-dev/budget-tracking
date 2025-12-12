import Redis from "ioredis";
import { config } from "./config";
import logger from "./logger";

const redis = new Redis({
  port: config.redis.port,
  host: config.redis.host,
});

redis.on("connect", () => logger.info("Redis connected"));
redis.on("error", (err) => logger.error("Redis error:", err));

export default redis;
