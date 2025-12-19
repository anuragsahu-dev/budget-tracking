"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config/config");
const logger_1 = __importDefault(require("./config/logger"));
const prisma_1 = __importDefault(require("./config/prisma"));
const redis_1 = __importDefault(require("./config/redis"));
const jobs_1 = require("./jobs");
const PORT = config_1.config.server.port;
async function gracefulShutdown(signal) {
    logger_1.default.info(`Received ${signal}. Starting graceful shutdown...`);
    try {
        await (0, jobs_1.shutdownWorkers)();
        logger_1.default.info("Background workers shut down");
        await prisma_1.default.$disconnect();
        logger_1.default.info("Database connection closed");
        await redis_1.default.quit();
        logger_1.default.info("Redis connection closed");
        logger_1.default.info("Graceful shutdown completed");
        process.exit(0);
    }
    catch (error) {
        logger_1.default.error("Error during graceful shutdown", {
            error: error instanceof Error
                ? { message: error.message, stack: error.stack }
                : error,
        });
        process.exit(1);
    }
}
async function startServer() {
    try {
        await prisma_1.default.$connect();
        logger_1.default.info("Database connected");
        await redis_1.default.ping();
        logger_1.default.info("Redis connected");
        await (0, jobs_1.initializeWorkers)();
        app_1.default.listen(PORT, () => {
            logger_1.default.info(`Server running on PORT: ${PORT} [${config_1.config.server.nodeEnv}]`);
        });
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    }
    catch (error) {
        logger_1.default.error("Failed to start server", {
            error: error instanceof Error
                ? { message: error.message, stack: error.stack }
                : error,
        });
        process.exit(1);
    }
}
startServer();
