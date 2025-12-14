import app from "./app";
import { config } from "./config/config";
import logger from "./config/logger";
import prisma from "./config/prisma";
import redis from "./config/redis";
import { initializeWorkers, shutdownWorkers } from "./jobs";

const PORT = config.server.port;

async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    // Shutdown workers first (let them finish processing)
    await shutdownWorkers();
    logger.info("Background workers shut down");

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

    // Initialize background workers
    await initializeWorkers();

    app.listen(PORT, () => {
      logger.info(`Server running on PORT: ${PORT} [${config.server.nodeEnv}]`);
    });

    // Register shutdown handlers
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server", {
      error:
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : error,
    });
    process.exit(1);
  }
}

startServer();
