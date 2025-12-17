import prisma from "../../config/prisma";
import {
  Prisma,
  Category,
  UserRole,
  UserStatus,
  Payment,
  PaymentStatus,
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
  UserFilters,
  PaginationOptions,
  PaymentFilters,
} from "./admin.types";

// Re-export types for consumers
export type { SafeUser, UserFilters, PaginationOptions };

// Safe user select fields
const SAFE_USER_SELECT = {
  id: true,
  email: true,
  fullName: true,
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
  ): Promise<PaginatedResult<SafeUser>> {
    const { role, status, search } = filters;
    const { page, limit, sortBy, sortOrder } = pagination;

    const whereClause: Prisma.UserWhereInput = {
      ...(role && { role }),
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
        select: SAFE_USER_SELECT,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    return {
      data: users as SafeUser[],
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

  static async getStats(from?: Date, to?: Date) {
    const dateFilter =
      from || to
        ? { createdAt: { ...(from && { gte: from }), ...(to && { lte: to }) } }
        : {};

    const [totalUsers, activeUsers, newUsers, totalTransactions, totalBudgets] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
        prisma.user.count({ where: dateFilter }),
        prisma.transaction.count({ where: dateFilter }),
        prisma.budget.count({ where: dateFilter }),
      ]);

    return {
      totalUsers,
      activeUsers,
      newUsers,
      totalTransactions,
      totalBudgets,
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
}
