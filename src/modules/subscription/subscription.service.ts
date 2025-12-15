import { SubscriptionRepository } from "./subscription.repository";
import { ApiError } from "../../middlewares/error.middleware";
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

    // Check if subscription has expired
    const isExpired =
      subscription.status === "ACTIVE" && subscription.expiresAt < new Date();

    if (isExpired) {
      // Mark as expired
      await SubscriptionRepository.updateSubscription(userId, {
        status: "EXPIRED",
      });
      subscription.status = "EXPIRED";
    }

    return {
      id: subscription.id,
      plan: subscription.plan,
      status: subscription.status,
      expiresAt: subscription.expiresAt,
      isActive: subscription.status === "ACTIVE",
      daysRemaining:
        subscription.status === "ACTIVE"
          ? Math.max(
              0,
              Math.ceil(
                (subscription.expiresAt.getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              )
            )
          : 0,
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

    return {
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        expiresAt: subscription.expiresAt,
        isActive: subscription.status === "ACTIVE",
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
   */
  static async cancelSubscription(userId: string) {
    const subscription = await SubscriptionRepository.findByUserId(userId);

    if (!subscription) {
      throw new ApiError(404, "No active subscription found");
    }

    if (subscription.status !== "ACTIVE") {
      throw new ApiError(400, "Subscription is not active");
    }

    const result = await SubscriptionRepository.cancelSubscription(userId);

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("Subscription cancelled", { userId });

    return {
      message: "Subscription cancelled successfully",
      expiresAt: result.data.expiresAt, // User can still use until expiry
    };
  }

  /**
   * Check if user has active subscription
   */
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await SubscriptionRepository.findByUserId(userId);

    if (!subscription) {
      return false;
    }

    return (
      subscription.status === "ACTIVE" && subscription.expiresAt > new Date()
    );
  }
}
