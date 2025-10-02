import app from "./app";
import { config } from "./config/config";
import logger from "./config/logger";
import prisma from "./database/prisma";

const PORT = config.server.port;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected");
    logger.info("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on PORT: ${PORT} [${config.server.nodeEnv}]`);
      logger.info(`Server running on PORT: ${PORT} [${config.server.nodeEnv}]`);
    });
  } catch (error) {
    logger.error("Failed to connect to database", {
      error:
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : error,
    });
    process.exit(1);
  }
}

startServer();
