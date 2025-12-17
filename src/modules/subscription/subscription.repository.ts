import prisma from "../../config/prisma";
import {
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
} from "../../generated/prisma/client";
import {
  PRISMA_ERROR,
  isPrismaError,
  RepositoryResult,
  notFoundError,
  duplicateError,
  unknownError,
} from "../../utils/repository.utils";

export class SubscriptionRepository {
  /**
   * Find subscription by user ID
   */
  static async findByUserId(userId: string): Promise<Subscription | null> {
    return prisma.subscription.findUnique({
      where: { userId },
    });
  }

  /**
   * Create a new subscription
   */
  static async createSubscription(data: {
    userId: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    expiresAt: Date;
  }): Promise<RepositoryResult<Subscription>> {
    try {
      const subscription = await prisma.subscription.create({ data });
      return { success: true, data: subscription };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION
      ) {
        return duplicateError("User already has a subscription");
      }
      return unknownError("Failed to create subscription", error);
    }
  }

  /**
   * Update subscription
   */
  static async updateSubscription(
    userId: string,
    data: {
      plan?: SubscriptionPlan;
      status?: SubscriptionStatus;
      expiresAt?: Date;
    }
  ): Promise<RepositoryResult<Subscription>> {
    try {
      const subscription = await prisma.subscription.update({
        where: { userId },
        data,
      });
      return { success: true, data: subscription };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("Subscription not found");
      }
      return unknownError("Failed to update subscription", error);
    }
  }

  /**
   * Activate or renew subscription
   */
  static async activateSubscription(
    userId: string,
    plan: SubscriptionPlan,
    expiresAt: Date
  ): Promise<RepositoryResult<Subscription>> {
    try {
      // Upsert: create if not exists, update if exists
      const subscription = await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          plan,
          status: SubscriptionStatus.ACTIVE,
          expiresAt,
        },
        update: {
          plan,
          status: SubscriptionStatus.ACTIVE,
          expiresAt,
        },
      });
      return { success: true, data: subscription };
    } catch (error) {
      return unknownError("Failed to activate subscription", error);
    }
  }

  /**
   * Mark expired subscriptions
   * Returns count of updated subscriptions
   */
  static async markExpiredSubscriptions(): Promise<number> {
    const result = await prisma.subscription.updateMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        expiresAt: { lt: new Date() },
      },
      data: {
        status: SubscriptionStatus.EXPIRED,
      },
    });
    return result.count;
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(
    userId: string
  ): Promise<RepositoryResult<Subscription>> {
    try {
      const subscription = await prisma.subscription.update({
        where: { userId },
        data: { status: SubscriptionStatus.CANCELLED },
      });
      return { success: true, data: subscription };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("Subscription not found");
      }
      return unknownError("Failed to cancel subscription", error);
    }
  }

  /**
   * Get subscription with payment history
   */
  static async findWithPayments(userId: string) {
    return prisma.subscription.findUnique({
      where: { userId },
      include: {
        payments: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  }
}
