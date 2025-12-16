import { Worker, Job } from "bullmq";
import { bullmqConnection } from "../../config/redis";
import logger from "../../config/logger";
import { SubscriptionRepository } from "../../modules/subscription/subscription.repository";
import prisma from "../../config/prisma";
import type { ScheduledJobType } from "../queues/scheduler.queue";

const QUEUE_NAME = "scheduler";

/**
 * Scheduler worker - processes scheduled/recurring jobs
 *
 * In Docker Swarm with multiple replicas:
 * - Each replica runs this worker
 * - BullMQ ensures only ONE worker picks up each job
 * - Redis acts as a distributed lock
 */
export const schedulerWorker = new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    const jobType = job.name as ScheduledJobType;
    const startTime = Date.now();

    logger.info(`Scheduled job started: ${jobType}`, { jobId: job.id });

    try {
      switch (jobType) {
        case "expire-subscriptions":
          await handleExpireSubscriptions();
          break;

        case "cleanup-expired-otps":
          await handleCleanupExpiredOtps();
          break;

        case "cleanup-old-sessions":
          await handleCleanupOldSessions();
          break;

        default:
          logger.warn(`Unknown scheduled job type: ${jobType}`);
      }

      const duration = Date.now() - startTime;
      logger.info(`Scheduled job completed: ${jobType}`, {
        jobId: job.id,
        durationMs: duration,
      });
    } catch (error) {
      logger.error(`Scheduled job failed: ${jobType}`, {
        jobId: job.id,
        error: error instanceof Error ? error.message : error,
      });
      throw error; // Re-throw to trigger retry
    }
  },
  {
    connection: bullmqConnection,
    concurrency: 1, // Process one job at a time
  }
);

// ============================================================
// JOB HANDLERS
// ============================================================

/**
 * Mark expired subscriptions as EXPIRED
 */
async function handleExpireSubscriptions(): Promise<void> {
  const count = await SubscriptionRepository.markExpiredSubscriptions();

  if (count > 0) {
    logger.info(`Marked ${count} subscriptions as expired`);
  } else {
    logger.debug("No subscriptions to expire");
  }
}

/**
 * Delete expired OTP records
 */
async function handleCleanupExpiredOtps(): Promise<void> {
  const result = await prisma.otp.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });

  if (result.count > 0) {
    logger.info(`Deleted ${result.count} expired OTP records`);
  }
}

/**
 * Delete old session records (older than 30 days)
 */
async function handleCleanupOldSessions(): Promise<void> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await prisma.session.deleteMany({
    where: {
      updatedAt: { lt: thirtyDaysAgo },
    },
  });

  if (result.count > 0) {
    logger.info(`Deleted ${result.count} old session records`);
  }
}

// ============================================================
// WORKER EVENT HANDLERS
// ============================================================

schedulerWorker.on("completed", (job) => {
  logger.debug(`Scheduler job completed`, { jobId: job?.id, name: job?.name });
});

schedulerWorker.on("failed", (job, error) => {
  logger.error(`Scheduler job failed`, {
    jobId: job?.id,
    name: job?.name,
    error: error.message,
    attempts: job?.attemptsMade,
  });
});

schedulerWorker.on("error", (error) => {
  logger.error("Scheduler worker error", { error: error.message });
});
