"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bullmqConnection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("./config");
const logger_1 = __importDefault(require("./logger"));
const isTest = process.env.NODE_ENV === "test";
function createRedisClient() {
    if (isTest) {
        const RedisMock = require("ioredis-mock");
        return new RedisMock();
    }
    const client = new ioredis_1.default({
        host: config_1.config.redis.host,
        port: config_1.config.redis.port,
    });
    client.on("connect", () => logger_1.default.info("Redis connected"));
    client.on("error", (err) => logger_1.default.error("Redis error:", err));
    return client;
}
exports.bullmqConnection = isTest
    ? { host: "localhost", port: 6379, maxRetriesPerRequest: null }
    : {
        host: config_1.config.redis.host,
        port: config_1.config.redis.port,
        maxRetriesPerRequest: null,
    };
const redis = createRedisClient();
exports.default = redis;
