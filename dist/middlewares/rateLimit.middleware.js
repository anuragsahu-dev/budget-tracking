"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.avatarUploadLimiter = exports.oauthLimiter = exports.refreshLimiter = exports.verifyLimiter = exports.startLimiter = exports.globalLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const rate_limit_redis_1 = require("rate-limit-redis");
const redis_1 = __importDefault(require("../config/redis"));
const isTest = process.env.NODE_ENV === "test";
function createRateLimiter(options) {
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
    if (isTest) {
        return (0, express_rate_limit_1.rateLimit)(baseConfig);
    }
    return (0, express_rate_limit_1.rateLimit)({
        ...baseConfig,
        store: new rate_limit_redis_1.RedisStore({
            prefix: options.keyPrefix,
            sendCommand: (command, ...args) => redis_1.default.call(command, ...args),
        }),
    });
}
exports.globalLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyPrefix: "global:",
    message: "Too many requests, please try again later.",
});
exports.startLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 6,
    keyPrefix: "start:",
    message: "Too many attempts. Please slow down.",
});
exports.verifyLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 6,
    keyPrefix: "verify:",
    message: "Too many attempts. Please slow down.",
});
exports.refreshLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    keyPrefix: "refresh:",
    message: "Too many token refresh attempts. Please try again later.",
});
exports.oauthLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    keyPrefix: "oauth:",
    message: "Too many OAuth attempts. Please try again later.",
});
exports.avatarUploadLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    keyPrefix: "avatar-upload:",
    message: "Too many avatar upload attempts. Please try again later.",
});
