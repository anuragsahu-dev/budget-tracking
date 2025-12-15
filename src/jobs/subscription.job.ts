import { SubscriptionRepository } from "../modules/subscription/subscription.repository";
import logger from "../config/logger";

/**
 * Mark expired subscriptions as EXPIRED
 * Run this job daily via cron or task scheduler
 */
export async function markExpiredSubscriptions(): Promise<void> {
  try {
    const count = await SubscriptionRepository.markExpiredSubscriptions();

    if (count > 0) {
      logger.info(`Marked ${count} subscriptions as expired`);
    }
  } catch (error) {
    logger.error("Failed to mark expired subscriptions", { error });
  }
}

/**
 * Schedule the job to run periodically
 * Call this function during app startup
 */
export function scheduleSubscriptionJob(): void {
  // Run immediately on startup
  markExpiredSubscriptions();

  // Run every hour (3600000 ms)
  setInterval(markExpiredSubscriptions, 60 * 60 * 1000);

  logger.info("Subscription expiry job scheduled (runs every hour)");
}
