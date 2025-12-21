import { Worker, Job } from "bullmq";
import { bullmqConnection } from "../../config/redis";
import logger from "../../config/logger";
import { SubscriptionRepository } from "../../modules/subscription/subscription.repository";
import prisma from "../../config/prisma";
import type { ScheduledJobType } from "../queues/scheduler.queue";
import {
  PaymentStatus,
  SubscriptionStatus,
} from "../../generated/prisma/client";
import { queueSubscriptionExpiringEmail } from "../queues/email.queue";

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

        case "subscription-expiring-reminder":
          await handleSubscriptionExpiringReminder();
          break;

        case "cleanup-pending-payments":
          await handleCleanupPendingPayments();
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
 * Send reminder emails to users whose subscription expires in 7 days
 */
async function handleSubscriptionExpiringReminder(): Promise<void> {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const sixDaysFromNow = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);

  // Find subscriptions expiring between 6-7 days from now
  // This ensures we only send once (within a 24-hour window)
  const expiringSubscriptions = await prisma.subscription.findMany({
    where: {
      status: SubscriptionStatus.ACTIVE,
      expiresAt: {
        gte: sixDaysFromNow,
        lt: sevenDaysFromNow,
      },
    },
    include: {
      user: {
        select: {
          email: true,
          fullName: true,
        },
      },
    },
  });

  if (expiringSubscriptions.length === 0) {
    logger.debug("No subscriptions expiring in 7 days");
    return;
  }

  let emailsSent = 0;
  for (const subscription of expiringSubscriptions) {
    try {
      await queueSubscriptionExpiringEmail(
        subscription.user.email,
        subscription.user.fullName || "Valued Customer",
        subscription.plan,
        subscription.expiresAt
      );
      emailsSent++;
    } catch (error) {
      logger.warn("Failed to queue expiring subscription email", {
        userId: subscription.userId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  logger.info(`Queued ${emailsSent} subscription expiring reminder emails`);
}

/**
 * Mark payments that have been PENDING for 24+ hours as FAILED
 * These are abandoned payment orders where user didn't complete payment
 */
async function handleCleanupPendingPayments(): Promise<void> {
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  const result = await prisma.payment.updateMany({
    where: {
      status: PaymentStatus.PENDING,
      createdAt: { lt: twentyFourHoursAgo },
    },
    data: {
      status: PaymentStatus.FAILED,
      failureReason: "Payment abandoned - order expired after 24 hours",
    },
  });

  if (result.count > 0) {
    logger.info(`Marked ${result.count} abandoned payments as failed`);
  } else {
    logger.debug("No abandoned payments to cleanup");
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
