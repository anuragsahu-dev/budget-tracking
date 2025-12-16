import { Queue } from "bullmq";
import { bullmqConnection } from "../../config/redis";
import logger from "../../config/logger";

const QUEUE_NAME = "scheduler";

/**
 * Scheduler queue for recurring/scheduled jobs
 * Uses BullMQ's repeatable jobs feature for cluster-safe execution
 */
export const schedulerQueue = new Queue(QUEUE_NAME, {
  connection: bullmqConnection,
  defaultJobOptions: {
    removeOnComplete: 100, // Keep last 100 completed jobs for debugging
    removeOnFail: 50, // Keep last 50 failed jobs
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

/**
 * Job types for scheduled tasks
 */
export type ScheduledJobType =
  | "expire-subscriptions"
  | "cleanup-expired-otps"
  | "cleanup-old-sessions";

/**
 * Setup repeatable jobs
 * This should be called ONCE during application startup
 * BullMQ handles deduplication - calling this multiple times is safe
 */
export async function setupScheduledJobs(): Promise<void> {
  try {
    // Remove any existing repeatable jobs first (clean slate on deploy)
    const existingJobs = await schedulerQueue.getRepeatableJobs();
    for (const job of existingJobs) {
      await schedulerQueue.removeRepeatableByKey(job.key);
    }

    // ============================================================
    // 1. EXPIRE SUBSCRIPTIONS - Run every hour
    // Marks subscriptions as EXPIRED when expiresAt < now
    // ============================================================
    await schedulerQueue.add(
      "expire-subscriptions",
      { description: "Mark expired subscriptions" },
      {
        repeat: {
          every: 60 * 60 * 1000, // Every 1 hour (in milliseconds)
        },
        jobId: "expire-subscriptions", // Ensures only one repeatable job
      }
    );

    // ============================================================
    // 2. CLEANUP EXPIRED OTPs - Run every 6 hours
    // Deletes OTP records older than their expiry
    // ============================================================
    await schedulerQueue.add(
      "cleanup-expired-otps",
      { description: "Delete expired OTP records" },
      {
        repeat: {
          every: 6 * 60 * 60 * 1000, // Every 6 hours
        },
        jobId: "cleanup-expired-otps",
      }
    );

    // ============================================================
    // 3. CLEANUP OLD SESSIONS - Run every day
    // Deletes sessions older than 30 days
    // ============================================================
    await schedulerQueue.add(
      "cleanup-old-sessions",
      { description: "Delete old session records" },
      {
        repeat: {
          every: 24 * 60 * 60 * 1000, // Every 24 hours
        },
        jobId: "cleanup-old-sessions",
      }
    );

    const jobs = await schedulerQueue.getRepeatableJobs();
    logger.info("Scheduled jobs configured", {
      jobs: jobs.map((j) => ({ name: j.name, every: j.every })),
    });
  } catch (error) {
    logger.error("Failed to setup scheduled jobs", { error });
    throw error;
  }
}

/**
 * Get status of all scheduled jobs
 */
export async function getScheduledJobsStatus() {
  const repeatableJobs = await schedulerQueue.getRepeatableJobs();
  const waiting = await schedulerQueue.getWaiting();
  const active = await schedulerQueue.getActive();
  const failed = await schedulerQueue.getFailed();

  return {
    repeatable: repeatableJobs.map((j) => ({
      name: j.name,
      every: j.every,
      next: j.next ? new Date(j.next).toISOString() : null,
    })),
    counts: {
      waiting: waiting.length,
      active: active.length,
      failed: failed.length,
    },
  };
}
