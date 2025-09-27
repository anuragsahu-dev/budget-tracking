import app from "./app";
import { config } from "./config/config";
import logger from "./config/logger";

const PORT = config.server.port;

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  logger.error("Uncaught Exception! Shutting down...");
  logger.error(err.stack || err.message);
  process.exit(1);
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT} [${config.server.nodeEnv}]`);
  logger.info(`Server running on PORT: ${PORT} [${config.server.nodeEnv}]`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: unknown) => {
  logger.error("Unhandled Promise Rejection! Shutting down...");

  // Narrow the type safely
  if (reason instanceof Error) {
    logger.error(reason.stack || reason.message);
  } else {
    logger.error(JSON.stringify(reason));
  }

  server.close(() => process.exit(1));
});

// Graceful shutdown on signals
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => logger.info("Server terminated."));
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
