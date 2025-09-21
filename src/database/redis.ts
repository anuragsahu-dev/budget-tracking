import Redis from "ioredis";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

import type { RedisReply } from "rate-limit-redis";

import { config } from "../config/config";

const redis = new Redis({
  port: config.redis.port,
  host: config.redis.host,
});

export function redisRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
  keyPrefix: string; // signup:, login:, global:
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 429,
      error: options.message || "Too many requests, please try again later.",
    },
    store: new RedisStore({
      prefix: options.keyPrefix,
      sendCommand: (
        command: string,
        ...args: string[]
      ): Promise<RedisReply> => {
        return redis.call(command, ...args) as Promise<RedisReply>;
      },
    }),
  });
}

export default redis;
