import prisma from "../../config/prisma";
import {
  Prisma,
  Transaction,
  TransactionType,
} from "../../generated/prisma/client";
import {
  PRISMA_ERROR,
  isPrismaError,
  RepositoryResult,
  PaginatedResult,
  createPaginationMeta,
  notFoundError,
  unknownError,
} from "../../utils/repository.utils";
import type {
  TransactionWithCategory,
  TransactionFilters,
  TransactionPaginationOptions,
} from "./transaction.types";

// Re-export types for consumers
export type {
  TransactionWithCategory,
  TransactionFilters,
  TransactionPaginationOptions,
};

// Category select for includes
const CATEGORY_SELECT = {
  id: true,
  name: true,
  slug: true,
  color: true,
} as const;

function invalidCategoryError(): RepositoryResult<never> {
  return {
    success: false,
    error: "INVALID_REFERENCE",
    statusCode: 400,
    message: "Invalid category ID provided",
  };
}

export class TransactionRepository {
  static async findAllByUser(
    filters: TransactionFilters,
    pagination: TransactionPaginationOptions
  ): Promise<PaginatedResult<TransactionWithCategory>> {
    const { userId, type, categoryId, from, to } = filters;
    const { page, limit, sortBy, sortOrder } = pagination;

    const whereClause: Prisma.TransactionWhereInput = {
      userId,
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...(from || to
        ? { date: { ...(from && { gte: from }), ...(to && { lte: to }) } }
        : {}),
    };

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        include: { category: { select: CATEGORY_SELECT } },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where: whereClause }),
    ]);

    return {
      data: transactions,
      meta: createPaginationMeta(total, page, limit),
    };
  }

  static async findById(id: string): Promise<TransactionWithCategory | null> {
    return prisma.transaction.findUnique({
      where: { id },
      include: { category: { select: CATEGORY_SELECT } },
    });
  }

  static async findByIdAndUser(
    id: string,
    userId: string
  ): Promise<TransactionWithCategory | null> {
    return prisma.transaction.findFirst({
      where: { id, userId },
      include: { category: { select: CATEGORY_SELECT } },
    });
  }

  static async create(
    data: Prisma.TransactionCreateInput
  ): Promise<RepositoryResult<TransactionWithCategory>> {
    try {
      const transaction = await prisma.transaction.create({
        data,
        include: { category: { select: CATEGORY_SELECT } },
      });
      return { success: true, data: transaction };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.FOREIGN_KEY_CONSTRAINT_VIOLATION
      ) {
        return invalidCategoryError();
      }
      return unknownError("Failed to create transaction", error);
    }
  }

  static async update(
    id: string,
    data: Prisma.TransactionUpdateInput
  ): Promise<RepositoryResult<TransactionWithCategory>> {
    try {
      const transaction = await prisma.transaction.update({
        where: { id },
        data,
        include: { category: { select: CATEGORY_SELECT } },
      });
      return { success: true, data: transaction };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
          return notFoundError("Transaction not found");
        }
        if (error.code === PRISMA_ERROR.FOREIGN_KEY_CONSTRAINT_VIOLATION) {
          return invalidCategoryError();
        }
      }
      return unknownError("Failed to update transaction", error);
    }
  }

  static async delete(id: string): Promise<RepositoryResult<Transaction>> {
    try {
      const transaction = await prisma.transaction.delete({ where: { id } });
      return { success: true, data: transaction };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("Transaction not found");
      }
      return unknownError("Failed to delete transaction", error);
    }
  }

  static async getSummaryByUser(
    userId: string,
    from?: Date,
    to?: Date
  ): Promise<{
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
  }> {
    const whereClause: Prisma.TransactionWhereInput = {
      userId,
      ...(from || to
        ? { date: { ...(from && { gte: from }), ...(to && { lte: to }) } }
        : {}),
    };

    const [incomeResult, expenseResult] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...whereClause, type: TransactionType.INCOME },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...whereClause, type: TransactionType.EXPENSE },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = Number(incomeResult._sum.amount ?? 0);
    const totalExpense = Number(expenseResult._sum.amount ?? 0);

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
    };
  }
}
