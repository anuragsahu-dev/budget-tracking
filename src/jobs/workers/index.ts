import logger from "../../config/logger";
import { emailWorker } from "./email.worker";
import { schedulerWorker } from "./scheduler.worker";
import { setupScheduledJobs } from "../queues/scheduler.queue";

/**
 * Initialize all workers
 * Call this function during application startup
 */
export async function initializeWorkers(): Promise<void> {
  logger.info("Initializing background workers...");

  // Setup scheduled jobs (BullMQ repeatable jobs)
  await setupScheduledJobs();

  // Workers are auto-started when imported
  // Email worker and Scheduler worker are now running

  logger.info("Background workers initialized", {
    workers: ["email", "scheduler"],
  });
}

/**
 * Gracefully shutdown all workers
 * Call this function during application shutdown
 */
export async function shutdownWorkers(): Promise<void> {
  logger.info("Shutting down background workers...");

  await Promise.all([emailWorker.close(), schedulerWorker.close()]);

  logger.info("Background workers shut down successfully");
}

export { emailWorker, schedulerWorker };
