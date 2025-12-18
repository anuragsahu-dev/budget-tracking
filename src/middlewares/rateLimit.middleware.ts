import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../config/redis";

import type { RedisReply } from "rate-limit-redis";

const isTest = process.env.NODE_ENV === "test";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyPrefix: string;
  message?: string;
}

function createRateLimiter(options: RateLimitOptions) {
  const baseConfig = {
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 429,
      error: options.message || "Too many requests, please try again later.",
    },
  };

  // Use in-memory store for tests
  if (isTest) {
    return rateLimit(baseConfig);
  }

  // Use Redis store for production
  return rateLimit({
    ...baseConfig,
    store: new RedisStore({
      prefix: options.keyPrefix,
      sendCommand: (command: string, ...args: string[]): Promise<RedisReply> =>
        redis.call(command, ...args) as Promise<RedisReply>,
    }),
  });
}

// Global rate limiter: 100 requests per 15 minutes
export const globalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyPrefix: "global:",
  message: "Too many requests, please try again later.",
});

// Auth start rate limiter: 6 attempts per 15 minutes
export const startLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 6,
  keyPrefix: "start:",
  message: "Too many attempts. Please slow down.",
});
