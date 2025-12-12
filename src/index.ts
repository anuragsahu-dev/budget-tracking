import app from "./app";
import { config } from "./config/config";
import logger from "./config/logger";
import prisma from "./database/prisma";
import redis from "./config/redis";

const PORT = config.server.port;

async function startServer() {
  try {
    // check postgres
    await prisma.$connect();
    console.log("Database connected");
    logger.info("Database connected");

    // check redis
    await redis.ping();
    console.log("Redis connected");
    logger.info("Redis connected");

    app.listen(PORT, () => {
      console.log(`Server running on PORT: ${PORT} [${config.server.nodeEnv}]`);
      logger.info(`Server running on PORT: ${PORT} [${config.server.nodeEnv}]`);
    });
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
