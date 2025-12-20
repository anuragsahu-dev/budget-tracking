import prisma from "../../config/prisma";
import {
  Prisma,
  Budget,
  BudgetAllocation,
} from "../../generated/prisma/client";
import {
  PRISMA_ERROR,
  isPrismaError,
  RepositoryResult,
  PaginatedResult,
  createPaginationMeta,
  notFoundError,
  duplicateError,
  unknownError,
} from "../../utils/repository.utils";
import type {
  BudgetWithAllocations,
  BudgetFilters,
  BudgetPaginationOptions,
  AllocationWithCategory,
} from "./budget.types";

// Re-export only types used by consumers
export type { BudgetWithAllocations };

// Category select constant
const CATEGORY_SELECT = {
  id: true,
  name: true,
  slug: true,
  color: true,
} as const;

// Allocations include constant
const ALLOCATIONS_INCLUDE = {
  allocations: {
    include: {
      category: { select: CATEGORY_SELECT },
    },
  },
} as const;

function invalidCategoryError(): RepositoryResult<never> {
  return {
    success: false,
    error: "INVALID_REFERENCE",
    statusCode: 400,
    message: "Invalid category ID provided",
  };
}

export class BudgetRepository {
  static async findAllByUser(
    filters: BudgetFilters,
    pagination: BudgetPaginationOptions
  ): Promise<PaginatedResult<BudgetWithAllocations>> {
    const { userId, month, year } = filters;
    const { page, limit } = pagination;

    const whereClause: Prisma.BudgetWhereInput = {
      userId,
      ...(month && { month }),
      ...(year && { year }),
    };

    const skip = (page - 1) * limit;

    const [budgets, total] = await Promise.all([
      prisma.budget.findMany({
        where: whereClause,
        include: ALLOCATIONS_INCLUDE,
        orderBy: [{ year: "desc" }, { month: "desc" }],
        skip,
        take: limit,
      }),
      prisma.budget.count({ where: whereClause }),
    ]);

    return { data: budgets, meta: createPaginationMeta(total, page, limit) };
  }

  static async findById(id: string): Promise<BudgetWithAllocations | null> {
    return prisma.budget.findUnique({
      where: { id },
      include: ALLOCATIONS_INCLUDE,
    });
  }

  static async findByUserMonthYear(
    userId: string,
    month: number,
    year: number
  ): Promise<Budget | null> {
    return prisma.budget.findUnique({
      where: { userId_month_year: { userId, month, year } },
    });
  }

  static async create(
    data: Prisma.BudgetCreateInput
  ): Promise<RepositoryResult<BudgetWithAllocations>> {
    try {
      const budget = await prisma.budget.create({
        data,
        include: ALLOCATIONS_INCLUDE,
      });
      return { success: true, data: budget };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION
      ) {
        return duplicateError(
          "A budget for this month and year already exists"
        );
      }
      return unknownError("Failed to create budget", error);
    }
  }

  static async update(
    id: string,
    data: Prisma.BudgetUpdateInput
  ): Promise<RepositoryResult<BudgetWithAllocations>> {
    try {
      const budget = await prisma.budget.update({
        where: { id },
        data,
        include: ALLOCATIONS_INCLUDE,
      });
      return { success: true, data: budget };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("Budget not found");
      }
      return unknownError("Failed to update budget", error);
    }
  }

  static async delete(id: string): Promise<RepositoryResult<Budget>> {
    try {
      const budget = await prisma.budget.delete({ where: { id } });
      return { success: true, data: budget };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("Budget not found");
      }
      return unknownError("Failed to delete budget", error);
    }
  }

  // ========== ALLOCATION METHODS ==========

  static async findAllocationById(
    id: string
  ): Promise<AllocationWithCategory | null> {
    return prisma.budgetAllocation.findUnique({
      where: { id },
      include: { category: { select: CATEGORY_SELECT } },
    });
  }

  static async findAllocationByBudgetAndCategory(
    budgetId: string,
    categoryId: string
  ): Promise<BudgetAllocation | null> {
    return prisma.budgetAllocation.findUnique({
      where: { budgetId_categoryId: { budgetId, categoryId } },
    });
  }

  static async createAllocation(
    data: Prisma.BudgetAllocationCreateInput
  ): Promise<RepositoryResult<AllocationWithCategory>> {
    try {
      const allocation = await prisma.budgetAllocation.create({
        data,
        include: { category: { select: CATEGORY_SELECT } },
      });
      return { success: true, data: allocation };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
          return duplicateError(
            "An allocation for this category already exists in this budget"
          );
        }
        if (error.code === PRISMA_ERROR.FOREIGN_KEY_CONSTRAINT_VIOLATION) {
          return invalidCategoryError();
        }
      }
      return unknownError("Failed to create budget allocation", error);
    }
  }

  static async updateAllocation(
    id: string,
    data: Prisma.BudgetAllocationUpdateInput
  ): Promise<RepositoryResult<AllocationWithCategory>> {
    try {
      const allocation = await prisma.budgetAllocation.update({
        where: { id },
        data,
        include: { category: { select: CATEGORY_SELECT } },
      });
      return { success: true, data: allocation };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("Budget allocation not found");
      }
      return unknownError("Failed to update budget allocation", error);
    }
  }

  static async deleteAllocation(
    id: string
  ): Promise<RepositoryResult<BudgetAllocation>> {
    try {
      const allocation = await prisma.budgetAllocation.delete({
        where: { id },
      });
      return { success: true, data: allocation };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("Budget allocation not found");
      }
      return unknownError("Failed to delete budget allocation", error);
    }
  }
}
