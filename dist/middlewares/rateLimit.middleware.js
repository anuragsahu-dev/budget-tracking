"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startLimiter = exports.globalLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const rate_limit_redis_1 = require("rate-limit-redis");
const redis_1 = __importDefault(require("../config/redis"));
function redisRateLimiter(options) {
    return (0, express_rate_limit_1.rateLimit)({
        windowMs: options.windowMs,
        max: options.max,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            status: 429,
            error: options.message || "Too many requests, please try again later.",
        },
        store: new rate_limit_redis_1.RedisStore({
            prefix: options.keyPrefix,
            sendCommand: (command, ...args) => {
                return redis_1.default.call(command, ...args);
            },
        }),
    });
}
exports.globalLimiter = redisRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
    keyPrefix: "global:",
});
exports.startLimiter = redisRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 6,
    message: "Too many attempts. Please slow down.",
    keyPrefix: "start:",
});
