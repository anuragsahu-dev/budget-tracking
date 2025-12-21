import { AdminRepository } from "./admin.repository";
import { PlanPricingRepository } from "./planPricing.repository";
import { ApiError } from "../../middlewares/error.middleware";
import type {
  CreateSystemCategoryInput,
  UpdateSystemCategoryInput,
  ListUsersQuery,
  UpdateUserStatusInput,
  StatsQuery,
  ListPaymentsQuery,
  CreatePlanPricingInput,
  UpdatePlanPricingInput,
  ListSubscriptionsQuery,
  UpdateSubscriptionInput,
  CreateSubscriptionInput,
  UpdatePaymentInput,
} from "./admin.validation";
import {
  SubscriptionStatus,
  SubscriptionPlan,
  PaymentStatus,
} from "../../generated/prisma/client";
import logger from "../../config/logger";
import { generateSlug } from "../../utils/slug";

// ========== SYSTEM CATEGORY SERVICE ==========

export class AdminService {
  /**
   * Get all system categories
   */
  static async getAllSystemCategories() {
    const categories = await AdminRepository.findAllSystemCategories();

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      color: category.color,
      createdAt: category.createdAt,
    }));
  }

  /**
   * Create a new system category
   */
  static async createSystemCategory(
    adminId: string,
    data: CreateSystemCategoryInput
  ) {
    const slug = generateSlug(data.name);

    // Check if slug already exists
    const existing = await AdminRepository.findSystemCategoryBySlug(slug);
    if (existing) {
      throw new ApiError(
        409,
        "A system category with a similar name already exists"
      );
    }

    const result = await AdminRepository.createSystemCategory({
      name: data.name,
      slug,
      color: data.color ?? null,
    });

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("System category created", {
      adminId,
      categoryId: result.data.id,
      name: result.data.name,
      slug: result.data.slug,
    });

    return {
      id: result.data.id,
      name: result.data.name,
      slug: result.data.slug,
      color: result.data.color,
      createdAt: result.data.createdAt,
    };
  }

  /**
   * Update a system category
   */
  static async updateSystemCategory(
    adminId: string,
    categoryId: string,
    data: UpdateSystemCategoryInput
  ) {
    const category = await AdminRepository.findSystemCategoryById(categoryId);

    if (!category) {
      throw new ApiError(404, "System category not found");
    }

    const updateData: { name?: string; slug?: string; color?: string | null } =
      {};

    // Check for slug conflicts if name is being updated
    if (data.name && data.name !== category.name) {
      const newSlug = generateSlug(data.name);

      if (newSlug !== category.slug) {
        const existing = await AdminRepository.findSystemCategoryBySlug(
          newSlug
        );
        if (existing && existing.id !== categoryId) {
          throw new ApiError(
            409,
            "A system category with a similar name already exists"
          );
        }
        updateData.slug = newSlug;
      }

      updateData.name = data.name;
    }

    if (data.color !== undefined) {
      updateData.color = data.color;
    }

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, "No valid fields to update");
    }

    const result = await AdminRepository.updateSystemCategory(
      categoryId,
      updateData
    );

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("System category updated", {
      adminId,
      categoryId,
      changes: updateData,
    });

    return {
      id: result.data.id,
      name: result.data.name,
      slug: result.data.slug,
      color: result.data.color,
      createdAt: result.data.createdAt,
    };
  }

  /**
   * Delete a system category
   */
  static async deleteSystemCategory(adminId: string, categoryId: string) {
    const category = await AdminRepository.findSystemCategoryById(categoryId);

    if (!category) {
      throw new ApiError(404, "System category not found");
    }

    // Check if category is in use
    const hasTransactions = await AdminRepository.systemCategoryHasTransactions(
      categoryId
    );
    if (hasTransactions) {
      throw new ApiError(
        409,
        "Cannot delete system category with existing transactions"
      );
    }

    const hasBudgetAllocations =
      await AdminRepository.systemCategoryHasBudgetAllocations(categoryId);
    if (hasBudgetAllocations) {
      throw new ApiError(
        409,
        "Cannot delete system category with existing budget allocations"
      );
    }

    const result = await AdminRepository.deleteSystemCategory(categoryId);

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("System category deleted", {
      adminId,
      categoryId,
      name: category.name,
      slug: category.slug,
    });

    return { message: "System category deleted successfully" };
  }

  // ========== USER MANAGEMENT SERVICE ==========

  /**
   * Get all users with filters and pagination
   */
  static async getAllUsers(query: ListUsersQuery) {
    const { status, search, page, limit, sortBy, sortOrder } = query;

    const result = await AdminRepository.findAllUsers(
      { status, search },
      { page, limit, sortBy, sortOrder }
    );

    return {
      users: result.data,
      meta: result.meta,
    };
  }

  /**
   * Get a single user by ID
   */
  static async getUserById(userId: string) {
    const user = await AdminRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  /**
   * Update user status
   */
  static async updateUserStatus(
    userId: string,
    adminId: string,
    data: UpdateUserStatusInput
  ) {
    // Prevent admin from changing their own status
    if (userId === adminId) {
      logger.warn("Admin attempted to change own status", { adminId });
      throw new ApiError(403, "You cannot change your own status");
    }

    const user = await AdminRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.status === data.status) {
      throw new ApiError(400, `User already has the ${data.status} status`);
    }

    const result = await AdminRepository.updateUserStatus(userId, data.status);

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("User status updated", {
      userId,
      adminId,
      oldStatus: user.status,
      newStatus: data.status,
    });

    return result.data;
  }

  // ========== STATISTICS SERVICE ==========

  /**
   * Get platform statistics
   * Returns overview (all-time) and period (date-filtered) stats
   */
  static async getStats(query: StatsQuery) {
    return AdminRepository.getStats(query.from, query.to);
  }

  // ========== PAYMENT MANAGEMENT SERVICE ==========

  /**
   * Get all payments with filters and pagination
   */
  static async getAllPayments(query: ListPaymentsQuery) {
    const { userId, status, plan, from, to, page, limit, sortBy, sortOrder } =
      query;

    const result = await AdminRepository.findAllPayments(
      { userId, status, plan, from, to },
      { page, limit, sortBy, sortOrder }
    );

    return {
      payments: result.data,
      meta: result.meta,
    };
  }

  /**
   * Get payment by ID
   */
  static async getPaymentById(paymentId: string) {
    const payment = await AdminRepository.findPaymentById(paymentId);

    if (!payment) {
      throw new ApiError(404, "Payment not found");
    }

    return payment;
  }

  /**
   * Get payment statistics
   */
  static async getPaymentStats(query: StatsQuery) {
    return AdminRepository.getPaymentStats(query.from, query.to);
  }

  // ========== PLAN PRICING SERVICE ==========

  /**
   * Get all plan pricing (including inactive)
   */
  static async getAllPlanPricing() {
    const pricing = await PlanPricingRepository.findAll();
    return pricing;
  }

  /**
   * Get active plan pricing only
   */
  static async getActivePlanPricing() {
    const pricing = await PlanPricingRepository.findAllActive();
    return pricing;
  }

  /**
   * Create plan pricing
   */
  static async createPlanPricing(
    adminId: string,
    data: CreatePlanPricingInput
  ) {
    const result = await PlanPricingRepository.create(data);

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("Plan pricing created", {
      adminId,
      pricingId: result.data.id,
      plan: result.data.plan,
      currency: result.data.currency,
    });

    return result.data;
  }

  /**
   * Update plan pricing
   */
  static async updatePlanPricing(
    adminId: string,
    pricingId: string,
    data: UpdatePlanPricingInput
  ) {
    const pricing = await PlanPricingRepository.findById(pricingId);

    if (!pricing) {
      throw new ApiError(404, "Plan pricing not found");
    }

    if (Object.keys(data).length === 0) {
      throw new ApiError(400, "No valid fields to update");
    }

    const result = await PlanPricingRepository.update(pricingId, data);

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("Plan pricing updated", {
      adminId,
      pricingId,
      plan: pricing.plan,
      currency: pricing.currency,
      changes: data,
    });

    return result.data;
  }

  /**
   * Delete plan pricing
   */
  static async deletePlanPricing(adminId: string, pricingId: string) {
    const pricing = await PlanPricingRepository.findById(pricingId);

    if (!pricing) {
      throw new ApiError(404, "Plan pricing not found");
    }

    const result = await PlanPricingRepository.delete(pricingId);

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("Plan pricing deleted", {
      adminId,
      pricingId,
      plan: pricing.plan,
      currency: pricing.currency,
    });

    return { message: "Plan pricing deleted successfully" };
  }

  // ========== SUBSCRIPTION MANAGEMENT SERVICE ==========

  /**
   * Get all subscriptions with filters and pagination
   */
  static async getAllSubscriptions(query: ListSubscriptionsQuery) {
    const { status, plan, expiringWithinDays, page, limit, sortBy, sortOrder } =
      query;

    const result = await AdminRepository.findAllSubscriptions(
      { status, plan, expiringWithinDays },
      { page, limit, sortBy, sortOrder }
    );

    return {
      subscriptions: result.data,
      meta: result.meta,
    };
  }

  /**
   * Get subscription by ID
   */
  static async getSubscriptionById(subscriptionId: string) {
    const subscription = await AdminRepository.findSubscriptionById(
      subscriptionId
    );

    if (!subscription) {
      throw new ApiError(404, "Subscription not found");
    }

    return subscription;
  }

  /**
   * Update subscription (extend, change status, change plan, or set exact expiry)
   */
  static async updateSubscription(
    adminId: string,
    subscriptionId: string,
    data: UpdateSubscriptionInput
  ) {
    const subscription = await AdminRepository.findSubscriptionById(
      subscriptionId
    );

    if (!subscription) {
      throw new ApiError(404, "Subscription not found");
    }

    const updateData: {
      status?: SubscriptionStatus;
      plan?: SubscriptionPlan;
      expiresAt?: Date;
    } = {};

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.plan) {
      updateData.plan = data.plan;
    }

    // Priority: exact expiresAt > extendDays
    if (data.expiresAt) {
      updateData.expiresAt = data.expiresAt;
    } else if (data.extendDays) {
      // Extend from current expiry or now, whichever is later
      const baseDate =
        subscription.expiresAt > new Date()
          ? subscription.expiresAt
          : new Date();
      updateData.expiresAt = new Date(
        baseDate.getTime() + data.extendDays * 24 * 60 * 60 * 1000
      );
    }

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, "No valid fields to update");
    }

    const result = await AdminRepository.updateSubscriptionById(
      subscriptionId,
      updateData
    );

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("Subscription updated by admin", {
      adminId,
      subscriptionId,
      userId: subscription.userId,
      previousPlan: subscription.plan,
      previousStatus: subscription.status,
      previousExpiresAt: subscription.expiresAt,
      changes: updateData,
    });

    return result.data;
  }

  /**
   * Create subscription for user (manual intervention)
   * Used when payment succeeded but subscription creation failed
   */
  static async createSubscriptionForUser(
    adminId: string,
    data: CreateSubscriptionInput
  ) {
    const user = await AdminRepository.findUserById(data.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const result = await AdminRepository.createSubscriptionForUser({
      userId: data.userId,
      plan: data.plan,
      expiresAt: data.expiresAt,
    });

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("Subscription created by admin (manual intervention)", {
      adminId,
      userId: data.userId,
      subscriptionId: result.data.id,
      plan: data.plan,
      expiresAt: data.expiresAt,
    });

    return result.data;
  }

  /**
   * Update payment (admin manual intervention)
   * Used to fix payment status or link subscriptionId
   */
  static async updatePayment(
    adminId: string,
    paymentId: string,
    data: UpdatePaymentInput
  ) {
    const payment = await AdminRepository.findPaymentById(paymentId);

    if (!payment) {
      throw new ApiError(404, "Payment not found");
    }

    if (Object.keys(data).length === 0) {
      throw new ApiError(400, "No valid fields to update");
    }

    const result = await AdminRepository.updatePaymentById(paymentId, data);

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("Payment updated by admin (manual intervention)", {
      adminId,
      paymentId,
      userId: payment.userId,
      previousStatus: payment.status,
      changes: data,
    });

    return result.data;
  }

  /**
   * Get subscription statistics
   */
  static async getSubscriptionStats() {
    return AdminRepository.getSubscriptionStats();
  }

  // ========== FORCE LOGOUT SERVICE ==========

  /**
   * Force logout user by revoking all sessions
   */
  static async forceLogoutUser(userId: string, adminId: string) {
    // Prevent admin from logging themselves out
    if (userId === adminId) {
      logger.warn("Admin attempted to force logout self", { adminId });
      throw new ApiError(403, "You cannot force logout yourself");
    }

    const user = await AdminRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const result = await AdminRepository.revokeAllUserSessions(userId);

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("User force logged out", {
      userId,
      adminId,
      revokedSessions: result.data.count,
    });

    return {
      message: `Successfully revoked ${result.data.count} session(s)`,
      revokedCount: result.data.count,
    };
  }
}
