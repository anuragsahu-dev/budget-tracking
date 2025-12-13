import prisma from "../../config/prisma";
import { Prisma, Category } from "../../generated/prisma/client";
import logger from "../../config/logger";

const PRISMA_ERROR = {
  RECORD_NOT_FOUND: "P2025",
  UNIQUE_CONSTRAINT_VIOLATION: "P2002",
  FOREIGN_KEY_CONSTRAINT_VIOLATION: "P2003",
} as const;

function isPrismaError(
  error: unknown
): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

type SuccessResult<T> = {
  success: true;
  data: T;
};

type ErrorResult = {
  success: false;
  error: "NOT_FOUND" | "DUPLICATE" | "IN_USE" | "FORBIDDEN" | "UNKNOWN";
  statusCode: number;
  message: string;
};

type RepositoryResult<T> = SuccessResult<T> | ErrorResult;

export class CategoryRepository {
  /**
   * Find all categories for a user (includes system categories where userId is null)
   */
  static async findAllByUser(
    userId: string,
    includeSystem = true
  ): Promise<Category[]> {
    const whereClause: Prisma.CategoryWhereInput = includeSystem
      ? {
          OR: [{ userId: null }, { userId }],
        }
      : { userId };

    return prisma.category.findMany({
      where: whereClause,
      orderBy: [{ userId: "asc" }, { name: "asc" }], // System categories first, then alphabetical
    });
  }

  /**
   * Find a single category by ID
   */
  static async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  /**
   * Find category by name for a specific user (to check duplicates)
   */
  static async findByNameAndUser(
    name: string,
    userId: string
  ): Promise<Category | null> {
    return prisma.category.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        userId,
      },
    });
  }

  /**
   * Find system category by name (userId is null)
   */
  static async findSystemCategoryByName(
    name: string
  ): Promise<Category | null> {
    return prisma.category.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        userId: null,
      },
    });
  }

  /**
   * Create a new category
   */
  static async create(
    data: Prisma.CategoryCreateInput
  ): Promise<RepositoryResult<Category>> {
    try {
      const category = await prisma.category.create({ data });
      return { success: true, data: category };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
          return {
            success: false,
            error: "DUPLICATE",
            statusCode: 409,
            message: "Category with this name already exists",
          };
        }
      }

      logger.error("CategoryRepository.create failed", { error });
      return {
        success: false,
        error: "UNKNOWN",
        statusCode: 500,
        message: "Failed to create category",
      };
    }
  }

  /**
   * Update a category
   */
  static async update(
    id: string,
    data: Prisma.CategoryUpdateInput
  ): Promise<RepositoryResult<Category>> {
    try {
      const category = await prisma.category.update({
        where: { id },
        data,
      });
      return { success: true, data: category };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
          return {
            success: false,
            error: "NOT_FOUND",
            statusCode: 404,
            message: "Category not found",
          };
        }
      }

      logger.error("CategoryRepository.update failed", { id, error });
      return {
        success: false,
        error: "UNKNOWN",
        statusCode: 500,
        message: "Failed to update category",
      };
    }
  }

  /**
   * Delete a category
   */
  static async delete(id: string): Promise<RepositoryResult<Category>> {
    try {
      const category = await prisma.category.delete({
        where: { id },
      });
      return { success: true, data: category };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
          return {
            success: false,
            error: "NOT_FOUND",
            statusCode: 404,
            message: "Category not found",
          };
        }
        if (error.code === PRISMA_ERROR.FOREIGN_KEY_CONSTRAINT_VIOLATION) {
          return {
            success: false,
            error: "IN_USE",
            statusCode: 409,
            message:
              "Cannot delete category that has transactions or budget allocations",
          };
        }
      }

      logger.error("CategoryRepository.delete failed", { id, error });
      return {
        success: false,
        error: "UNKNOWN",
        statusCode: 500,
        message: "Failed to delete category",
      };
    }
  }

  /**
   * Check if category has any transactions
   */
  static async hasTransactions(categoryId: string): Promise<boolean> {
    const count = await prisma.transaction.count({
      where: { categoryId },
    });
    return count > 0;
  }

  /**
   * Check if category has any budget allocations
   */
  static async hasBudgetAllocations(categoryId: string): Promise<boolean> {
    const count = await prisma.budgetAllocation.count({
      where: { categoryId },
    });
    return count > 0;
  }
}
