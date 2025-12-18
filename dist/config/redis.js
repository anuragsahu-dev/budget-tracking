"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bullmqConnection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("./config");
const logger_1 = __importDefault(require("./logger"));
const redis = new ioredis_1.default({
    port: config_1.config.redis.port,
    host: config_1.config.redis.host,
});
redis.on("connect", () => logger_1.default.info("Redis connected"));
redis.on("error", (err) => logger_1.default.error("Redis error:", err));
exports.bullmqConnection = {
    host: config_1.config.redis.host,
    port: config_1.config.redis.port,
    maxRetriesPerRequest: null,
};
exports.default = redis;
