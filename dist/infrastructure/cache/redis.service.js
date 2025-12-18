"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisService = exports.RedisService = void 0;
const redis_1 = __importDefault(require("../../config/redis"));
const logger_1 = __importDefault(require("../../config/logger"));
class RedisService {
    constructor() {
        this.JSON_PREFIX = "__JSON__:";
    }
    async set(key, value, ttlSeconds) {
        try {
            const data = typeof value === "string"
                ? value
                : this.JSON_PREFIX + JSON.stringify(value);
            if (ttlSeconds) {
                await redis_1.default.set(key, data, "EX", ttlSeconds);
            }
            else {
                await redis_1.default.set(key, data);
            }
        }
        catch (error) {
            logger_1.default.error(`Redis SET failed [${key}]`, error);
        }
    }
    async get(key) {
        try {
            const value = await redis_1.default.get(key);
            if (!value)
                return null;
            if (value.startsWith(this.JSON_PREFIX)) {
                try {
                    return JSON.parse(value.slice(this.JSON_PREFIX.length));
                }
                catch {
                    return null;
                }
            }
            return value;
        }
        catch (error) {
            logger_1.default.error(`Redis GET failed [${key}]`, error);
            return null;
        }
    }
    async del(key) {
        try {
            await redis_1.default.del(key);
        }
        catch (error) {
            logger_1.default.error(`Redis DEL failed [${key}]`, error);
        }
    }
    async exists(key) {
        try {
            return (await redis_1.default.exists(key)) === 1;
        }
        catch (error) {
            logger_1.default.error(`Redis EXISTS failed [${key}]`, error);
            return false;
        }
    }
}
exports.RedisService = RedisService;
exports.redisService = new RedisService();
exports.default = exports.redisService;
