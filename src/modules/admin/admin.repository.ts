import prisma from "../../config/prisma";
import {
  Prisma,
  Category,
  UserStatus,
  UserRole,
  Payment,
  PaymentStatus,
  Subscription,
  SubscriptionStatus,
  SubscriptionPlan,
} from "../../generated/prisma/client";
import {
  PRISMA_ERROR,
  isPrismaError,
  RepositoryResult,
  PaginatedResult,
  createPaginationMeta,
  notFoundError,
  duplicateError,
  inUseError,
  unknownError,
} from "../../utils/repository.utils";
import { CategoryRepository } from "../category/category.repository";
import type {
  SafeUser,
  UserSummary,
  UserFilters,
  PaginationOptions,
  PaymentFilters,
  SubscriptionFilters,
  SubscriptionWithUser,
  PlatformStats,
} from "./admin.types";

// Minimal fields for list view
const USER_SUMMARY_SELECT = {
  id: true,
  email: true,
  fullName: true,
  avatarUrl: true,
  status: true,
  createdAt: true,
} as const;

// Full fields for detail view
const SAFE_USER_SELECT = {
  id: true,
  email: true,
  fullName: true,
  avatarUrl: true,
  isEmailVerified: true,
  googleId: true,
  currency: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class AdminRepository {
  // ========== SYSTEM CATEGORY METHODS ==========
  // Reuse CategoryRepository for findById, hasTransactions, hasBudgetAllocations

  static async findAllSystemCategories(): Promise<Category[]> {
    return prisma.category.findMany({
      where: { userId: null },
      orderBy: { name: "asc" },
    });
  }

  static async findSystemCategoryById(id: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: { id, userId: null },
    });
  }

  static findSystemCategoryBySlug = CategoryRepository.findSystemCategoryBySlug;

  static async createSystemCategory(
    data: Omit<Prisma.CategoryCreateInput, "user">
  ): Promise<RepositoryResult<Category>> {
    try {
      const category = await prisma.category.create({
        data: { ...data, userId: null },
      });
      return { success: true, data: category };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION
      ) {
        return duplicateError(
          "A system category with this name already exists"
        );
      }
      return unknownError("Failed to create system category", error);
    }
  }

  static async updateSystemCategory(
    id: string,
    data: Prisma.CategoryUpdateInput
  ): Promise<RepositoryResult<Category>> {
    try {
      const category = await prisma.category.update({ where: { id }, data });
      return { success: true, data: category };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
          return notFoundError("System category not found");
        }
        if (error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
          return duplicateError(
            "A system category with this name already exists"
          );
        }
      }
      return unknownError("Failed to update system category", error);
    }
  }

  static async deleteSystemCategory(
    id: string
  ): Promise<RepositoryResult<Category>> {
    try {
      const category = await prisma.category.delete({ where: { id } });
      return { success: true, data: category };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
          return notFoundError("System category not found");
        }
        if (error.code === PRISMA_ERROR.FOREIGN_KEY_CONSTRAINT_VIOLATION) {
          return inUseError(
            "Cannot delete category in use by transactions or allocations"
          );
        }
      }
      return unknownError("Failed to delete system category", error);
    }
  }

  // Reuse from CategoryRepository
  static systemCategoryHasTransactions = CategoryRepository.hasTransactions;
  static systemCategoryHasBudgetAllocations =
    CategoryRepository.hasBudgetAllocations;

  // ========== USER MANAGEMENT METHODS ==========

  static async findAllUsers(
    filters: UserFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<UserSummary>> {
    const { status, search } = filters;
    const { page, limit, sortBy, sortOrder } = pagination;

    const whereClause: Prisma.UserWhereInput = {
      // Only fetch regular users, never admins
      role: UserRole.USER,
      ...(status && { status }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: "insensitive" as const } },
          { fullName: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: USER_SUMMARY_SELECT,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    return {
      data: users as UserSummary[],
      meta: createPaginationMeta(total, page, limit),
    };
  }

  static async findUserById(id: string): Promise<SafeUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: SAFE_USER_SELECT,
    }) as Promise<SafeUser | null>;
  }

  static async updateUserStatus(
    id: string,
    status: UserStatus
  ): Promise<RepositoryResult<SafeUser>> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { status },
        select: SAFE_USER_SELECT,
      });
      return { success: true, data: user as SafeUser };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("User not found");
      }
      return unknownError("Failed to update user status", error);
    }
  }

  // ========== STATISTICS METHODS ==========

  static async getStats(from?: Date, to?: Date): Promise<PlatformStats> {
    const dateFilter =
      from || to
        ? { createdAt: { ...(from && { gte: from }), ...(to && { lte: to }) } }
        : {};

    // All queries in parallel for performance
    const [
      // Overview stats (all-time, no date filter)
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalTransactions,
      totalBudgets,
      totalSystemCategories,
      // Period stats (date filtered)
      newUsers,
      newTransactions,
      newBudgets,
    ] = await Promise.all([
      // Overview - All time
      prisma.user.count({ where: { role: UserRole.USER } }),
      prisma.user.count({
        where: { role: UserRole.USER, status: UserStatus.ACTIVE },
      }),
      prisma.user.count({
        where: { role: UserRole.USER, status: UserStatus.SUSPENDED },
      }),
      prisma.transaction.count(),
      prisma.budget.count(),
      prisma.category.count({ where: { userId: null } }),
      // Period - With date filter (or all-time if no dates provided)
      prisma.user.count({ where: { role: UserRole.USER, ...dateFilter } }),
      prisma.transaction.count({ where: dateFilter }),
      prisma.budget.count({ where: dateFilter }),
    ]);

    return {
      overview: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalTransactions,
        totalBudgets,
        totalSystemCategories,
      },
      period: {
        from: from ?? null,
        to: to ?? null,
        newUsers,
        newTransactions,
        newBudgets,
      },
    };
  }

  // ========== PAYMENT MANAGEMENT METHODS ==========

  /**
   * Find all payments with filters and pagination
   */
  static async findAllPayments(
    filters: PaymentFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<Payment>> {
    const { userId, status, plan, from, to } = filters;
    const { page, limit, sortBy, sortOrder } = pagination;

    const whereClause: Prisma.PaymentWhereInput = {
      ...(userId && { userId }),
      ...(status && { status }),
      ...(plan && { plan }),
      ...(from || to
        ? { createdAt: { ...(from && { gte: from }), ...(to && { lte: to }) } }
        : {}),
    };

    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: whereClause,
        include: {
          user: {
            select: { id: true, email: true, fullName: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.payment.count({ where: whereClause }),
    ]);

    return {
      data: payments,
      meta: createPaginationMeta(total, page, limit),
    };
  }

  /**
   * Find payment by ID with user details
   */
  static async findPaymentById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, fullName: true },
        },
        subscription: true,
      },
    });
  }

  /**
   * Get payment statistics
   */
  static async getPaymentStats(from?: Date, to?: Date) {
    const dateFilter =
      from || to
        ? { createdAt: { ...(from && { gte: from }), ...(to && { lte: to }) } }
        : {};

    const [
      totalPayments,
      completedPayments,
      pendingPayments,
      failedPayments,
      refundedPayments,
      totalRevenue,
    ] = await Promise.all([
      prisma.payment.count({ where: dateFilter }),
      prisma.payment.count({
        where: { ...dateFilter, status: PaymentStatus.COMPLETED },
      }),
      prisma.payment.count({
        where: { ...dateFilter, status: PaymentStatus.PENDING },
      }),
      prisma.payment.count({
        where: { ...dateFilter, status: PaymentStatus.FAILED },
      }),
      prisma.payment.count({
        where: { ...dateFilter, status: PaymentStatus.REFUNDED },
      }),
      prisma.payment.aggregate({
        where: { ...dateFilter, status: PaymentStatus.COMPLETED },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalPayments,
      completedPayments,
      pendingPayments,
      failedPayments,
      refundedPayments,
      totalRevenue: Number(totalRevenue._sum.amount ?? 0),
    };
  }

  // ========== SUBSCRIPTION MANAGEMENT METHODS ==========

  /**
   * Find all subscriptions with filters and pagination
   */
  static async findAllSubscriptions(
    filters: SubscriptionFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<SubscriptionWithUser>> {
    const { status, plan, expiringWithinDays } = filters;
    const { page, limit, sortBy, sortOrder } = pagination;

    const whereClause: Prisma.SubscriptionWhereInput = {
      ...(plan && { plan }),
      ...(expiringWithinDays
        ? {
            status: SubscriptionStatus.ACTIVE,
            expiresAt: {
              lte: new Date(
                Date.now() + expiringWithinDays * 24 * 60 * 60 * 1000
              ),
              gte: new Date(),
            },
          }
        : status && { status }),
    };

    const skip = (page - 1) * limit;

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where: whereClause,
        include: {
          user: {
            select: { id: true, email: true, fullName: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.subscription.count({ where: whereClause }),
    ]);

    return {
      data: subscriptions as SubscriptionWithUser[],
      meta: createPaginationMeta(total, page, limit),
    };
  }

  /**
   * Find subscription by ID with user and payment details
   */
  static async findSubscriptionById(id: string) {
    return prisma.subscription.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, fullName: true },
        },
        payments: {
          select: {
            id: true,
            plan: true,
            amount: true,
            currency: true,
            status: true,
            paidAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });
  }

  /**
   * Update subscription by ID
   */
  static async updateSubscriptionById(
    id: string,
    data: {
      status?: SubscriptionStatus;
      plan?: SubscriptionPlan;
      expiresAt?: Date;
    }
  ): Promise<RepositoryResult<Subscription>> {
    try {
      const subscription = await prisma.subscription.update({
        where: { id },
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
   * Get subscription statistics
   */
  static async getSubscriptionStats() {
    const [
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      cancelledSubscriptions,
      monthlySubscriptions,
      yearlySubscriptions,
      expiringIn7Days,
    ] = await Promise.all([
      prisma.subscription.count(),
      prisma.subscription.count({
        where: { status: SubscriptionStatus.ACTIVE },
      }),
      prisma.subscription.count({
        where: { status: SubscriptionStatus.EXPIRED },
      }),
      prisma.subscription.count({
        where: { status: SubscriptionStatus.CANCELLED },
      }),
      prisma.subscription.count({
        where: {
          plan: SubscriptionPlan.PRO_MONTHLY,
          status: SubscriptionStatus.ACTIVE,
        },
      }),
      prisma.subscription.count({
        where: {
          plan: SubscriptionPlan.PRO_YEARLY,
          status: SubscriptionStatus.ACTIVE,
        },
      }),
      prisma.subscription.count({
        where: {
          status: SubscriptionStatus.ACTIVE,
          expiresAt: {
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            gte: new Date(),
          },
        },
      }),
    ]);

    return {
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      cancelledSubscriptions,
      monthlySubscriptions,
      yearlySubscriptions,
      expiringIn7Days,
    };
  }

  /**
   * Create subscription for user (admin manual intervention)
   * Used when payment succeeded but subscription creation failed
   */
  static async createSubscriptionForUser(data: {
    userId: string;
    plan: SubscriptionPlan;
    expiresAt: Date;
  }): Promise<RepositoryResult<Subscription>> {
    try {
      // Upsert to handle both new and existing subscriptions
      const subscription = await prisma.subscription.upsert({
        where: { userId: data.userId },
        create: {
          userId: data.userId,
          plan: data.plan,
          status: SubscriptionStatus.ACTIVE,
          expiresAt: data.expiresAt,
        },
        update: {
          plan: data.plan,
          status: SubscriptionStatus.ACTIVE,
          expiresAt: data.expiresAt,
        },
      });
      return { success: true, data: subscription };
    } catch (error) {
      return unknownError("Failed to create subscription", error);
    }
  }

  /**
   * Update payment by ID (admin manual intervention)
   * Used to link subscriptionId or update status manually
   */
  static async updatePaymentById(
    id: string,
    data: {
      status?: PaymentStatus;
      subscriptionId?: string | null;
      failureReason?: string | null;
    }
  ): Promise<RepositoryResult<Payment>> {
    try {
      const payment = await prisma.payment.update({
        where: { id },
        data,
      });
      return { success: true, data: payment };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("Payment not found");
      }
      return unknownError("Failed to update payment", error);
    }
  }

  // ========== SESSION MANAGEMENT ==========

  /**
   * Revoke all sessions for a user (force logout)
   */
  static async revokeAllUserSessions(
    userId: string
  ): Promise<RepositoryResult<{ count: number }>> {
    try {
      const result = await prisma.session.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
      return { success: true, data: { count: result.count } };
    } catch (error) {
      return unknownError("Failed to revoke user sessions", error);
    }
  }

  // ========== USER DELETION ==========

  /**
   * Permanently delete a user and all their data
   * This is irreversible - use with caution
   * Cascades: transactions, budgets, categories, sessions, payments, subscription
   */
  static async deleteUser(
    userId: string
  ): Promise<RepositoryResult<{ deleted: boolean }>> {
    try {
      // Check user exists and is not an admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) {
        return notFoundError("User not found");
      }

      if (user.role === UserRole.ADMIN) {
        return {
          success: false,
          statusCode: 403,
          message: "Cannot delete admin users",
          error: "FORBIDDEN",
        };
      }

      // Delete will cascade to all related data due to onDelete: Cascade
      await prisma.user.delete({
        where: { id: userId },
      });

      return { success: true, data: { deleted: true } };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("User not found");
      }
      return unknownError("Failed to delete user", error);
    }
  }
}
