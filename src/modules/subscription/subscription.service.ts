import { SubscriptionRepository } from "./subscription.repository";
import { ApiError } from "../../middlewares/error.middleware";
import { SubscriptionStatus } from "../../generated/prisma/client";
import logger from "../../config/logger";

export class SubscriptionService {
  /**
   * Get current subscription for user
   */
  static async getSubscription(userId: string) {
    const subscription = await SubscriptionRepository.findByUserId(userId);

    if (!subscription) {
      return null;
    }

    const now = new Date();

    // Check if subscription has expired (applies to both ACTIVE and CANCELLED)
    const isExpired =
      (subscription.status === SubscriptionStatus.ACTIVE ||
        subscription.status === SubscriptionStatus.CANCELLED) &&
      subscription.expiresAt < now;

    if (isExpired && subscription.status !== SubscriptionStatus.EXPIRED) {
      const result = await SubscriptionRepository.updateSubscription(userId, {
        status: SubscriptionStatus.EXPIRED,
      });

      if (result.success) {
        subscription.status = SubscriptionStatus.EXPIRED;
      }
    }

    // User has access if: ACTIVE, or CANCELLED but not yet expired
    const hasAccess = this.checkHasAccess(
      subscription.status,
      subscription.expiresAt
    );

    return {
      id: subscription.id,
      plan: subscription.plan,
      status: subscription.status,
      expiresAt: subscription.expiresAt,
      hasAccess,
      // CANCELLED subscriptions still show days remaining until they expire
      daysRemaining: hasAccess
        ? Math.max(
            0,
            Math.ceil(
              (subscription.expiresAt.getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            )
          )
        : 0,
      isCancelled: subscription.status === SubscriptionStatus.CANCELLED,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }

  /**
   * Get subscription with payment history
   */
  static async getSubscriptionWithHistory(userId: string) {
    const subscription = await SubscriptionRepository.findWithPayments(userId);

    if (!subscription) {
      return {
        subscription: null,
        payments: [],
      };
    }

    const hasAccess = this.checkHasAccess(
      subscription.status,
      subscription.expiresAt
    );

    return {
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        expiresAt: subscription.expiresAt,
        hasAccess,
        isCancelled: subscription.status === SubscriptionStatus.CANCELLED,
        createdAt: subscription.createdAt,
      },
      payments: subscription.payments.map((payment) => ({
        id: payment.id,
        plan: payment.plan,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
      })),
    };
  }

  /**
   * Cancel subscription
   * User retains access until expiresAt date
   */
  static async cancelSubscription(userId: string) {
    const subscription = await SubscriptionRepository.findByUserId(userId);

    if (!subscription) {
      throw new ApiError(404, "No subscription found");
    }

    // Can only cancel ACTIVE subscriptions
    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new ApiError(400, "Subscription is not active");
    }

    const result = await SubscriptionRepository.cancelSubscription(userId);

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    const daysRemaining = Math.ceil(
      (result.data.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    logger.info("Subscription cancelled", {
      userId,
      expiresAt: result.data.expiresAt,
      daysRemaining,
    });

    return {
      message: `Subscription cancelled. You will have access for ${daysRemaining} more days until ${result.data.expiresAt.toDateString()}.`,
      expiresAt: result.data.expiresAt,
      daysRemaining,
    };
  }

  /**
   * Check if user has active subscription (PRO access)
   * ACTIVE or CANCELLED subscriptions are valid until expiresAt
   */
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await SubscriptionRepository.findByUserId(userId);

    if (!subscription) {
      return false;
    }

    return this.checkHasAccess(subscription.status, subscription.expiresAt);
  }

  /**
   * Helper: Check if subscription grants access
   * - ACTIVE: always has access if not expired
   * - CANCELLED: still has access until expiresAt
   * - EXPIRED: no access
   */
  private static checkHasAccess(
    status: SubscriptionStatus,
    expiresAt: Date
  ): boolean {
    const now = new Date();
    const notExpired = expiresAt > now;

    // ACTIVE or CANCELLED subscriptions have access until expiry
    return (
      (status === SubscriptionStatus.ACTIVE ||
        status === SubscriptionStatus.CANCELLED) &&
      notExpired
    );
  }
}
