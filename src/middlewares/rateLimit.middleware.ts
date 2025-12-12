import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../config/redis";

import type { RedisReply } from "rate-limit-redis";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyPrefix: string;
  message?: string;
}

function redisRateLimiter(options: RateLimitOptions) {
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

export const globalLimiter = redisRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
  keyPrefix: "global:",
});

export const startLimiter = redisRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 6,
  message: "Too many attempts. Please slow down.",
  keyPrefix: "start:",
});
