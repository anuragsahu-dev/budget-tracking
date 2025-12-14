import logger from "../../config/logger";
import { emailWorker } from "./email.worker";

/**
 * Initialize all workers
 * Call this function during application startup
 */
export async function initializeWorkers(): Promise<void> {
  logger.info("Initializing background workers...");

  // Email worker is auto-started when imported
  // Add more workers here as needed

  logger.info("Background workers initialized", {
    workers: ["email"],
  });
}

/**
 * Gracefully shutdown all workers
 * Call this function during application shutdown
 */
export async function shutdownWorkers(): Promise<void> {
  logger.info("Shutting down background workers...");

  await emailWorker.close();

  logger.info("Background workers shut down successfully");
}

export { emailWorker };
