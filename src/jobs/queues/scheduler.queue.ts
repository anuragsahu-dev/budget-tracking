import { Queue } from "bullmq";
import { bullmqConnection } from "../../config/redis";
import logger from "../../config/logger";

const QUEUE_NAME = "scheduler";

/**
 * Scheduler queue for recurring/scheduled jobs
 * Uses BullMQ's upsertJobScheduler for cluster-safe scheduled execution
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
  | "subscription-expiring-reminder"
  | "cleanup-pending-payments"
  | "cleanup-expired-otps"
  | "cleanup-old-sessions";

// Time constants (in milliseconds)
const ONE_HOUR = 60 * 60 * 1000;
const SIX_HOURS = 6 * ONE_HOUR;
const ONE_DAY = 24 * ONE_HOUR;

/**
 * Setup job schedulers using the modern upsertJobScheduler API
 * This should be called ONCE during application startup
 * upsertJobScheduler is idempotent - calling multiple times is safe
 */
export async function setupScheduledJobs(): Promise<void> {
  try {
    // ============================================================
    // 1. EXPIRE SUBSCRIPTIONS - Run every hour
    // Marks subscriptions as EXPIRED when expiresAt < now
    // ============================================================
    await schedulerQueue.upsertJobScheduler(
      "expire-subscriptions", // Unique scheduler ID
      {
        every: ONE_HOUR,
      },
      {
        name: "expire-subscriptions",
        data: { description: "Mark expired subscriptions" },
      }
    );

    // ============================================================
    // 2. SUBSCRIPTION EXPIRING REMINDER - Run every day
    // Email users whose subscription expires in 7 days
    // ============================================================
    await schedulerQueue.upsertJobScheduler(
      "subscription-expiring-reminder",
      {
        every: ONE_DAY,
      },
      {
        name: "subscription-expiring-reminder",
        data: {
          description: "Send reminder emails for expiring subscriptions",
        },
      }
    );

    // ============================================================
    // 3. CLEANUP PENDING PAYMENTS - Run every day
    // Mark payments that have been PENDING for 24+ hours as FAILED
    // ============================================================
    await schedulerQueue.upsertJobScheduler(
      "cleanup-pending-payments",
      {
        every: ONE_DAY,
      },
      {
        name: "cleanup-pending-payments",
        data: { description: "Mark abandoned pending payments as failed" },
      }
    );

    // ============================================================
    // 4. CLEANUP EXPIRED OTPs - Run every 6 hours
    // Deletes OTP records older than their expiry
    // ============================================================
    await schedulerQueue.upsertJobScheduler(
      "cleanup-expired-otps",
      {
        every: SIX_HOURS,
      },
      {
        name: "cleanup-expired-otps",
        data: { description: "Delete expired OTP records" },
      }
    );

    // ============================================================
    // 5. CLEANUP OLD SESSIONS - Run every day
    // Deletes sessions older than 30 days
    // ============================================================
    await schedulerQueue.upsertJobScheduler(
      "cleanup-old-sessions",
      {
        every: ONE_DAY,
      },
      {
        name: "cleanup-old-sessions",
        data: { description: "Delete old session records" },
      }
    );

    // Log all configured schedulers
    const schedulers = await schedulerQueue.getJobSchedulers();
    
    logger.info("Job schedulers configured", {
      count: schedulers.length,
      schedulers: schedulers.map((s) => ({
        id: s.id,
        name: s.name,
        every: s.every,
        next: s.next ? new Date(s.next).toISOString() : null,
      })),
    });
  } catch (error) {
    logger.error("Failed to setup job schedulers", { error });
    throw error;
  }
}

/**
 * Get status of all job schedulers
 */
export async function getScheduledJobsStatus() {
  const schedulers = await schedulerQueue.getJobSchedulers();
  const waiting = await schedulerQueue.getWaiting();
  const active = await schedulerQueue.getActive();
  const failed = await schedulerQueue.getFailed();

  return {
    schedulers: schedulers.map((s) => ({
      id: s.id,
      name: s.name,
      every: s.every,
      next: s.next ? new Date(s.next).toISOString() : null,
    })),
    counts: {
      waiting: waiting.length,
      active: active.length,
      failed: failed.length,
    },
  };
}
