import app from "./app";
import { config } from "./config/config";
import logger from "./config/logger";
import prisma from "./config/prisma";
import redis from "./config/redis";

const PORT = config.server.port;

async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    await prisma.$disconnect();
    logger.info("Database connection closed");

    await redis.quit();
    logger.info("Redis connection closed");

    logger.info("Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    logger.error("Error during graceful shutdown", {
      error:
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : error,
    });
    process.exit(1);
  }
}

async function startServer(): Promise<void> {
  try {
    // Check postgres
    await prisma.$connect();
    logger.info("Database connected");

    // Check redis
    await redis.ping();
    logger.info("Redis connected");

    app.listen(PORT, () => {
      logger.info(`Server running on PORT: ${PORT} [${config.server.nodeEnv}]`);
    });

    // Register shutdown handlers
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to connect to database or redis", {
      error:
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : error,
    });
    process.exit(1);
  }
}

startServer();
