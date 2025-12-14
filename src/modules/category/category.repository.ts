import prisma from "../../config/prisma";
import { Prisma, Category } from "../../generated/prisma/client";
import {
  PRISMA_ERROR,
  isPrismaError,
  RepositoryResult,
  notFoundError,
  duplicateError,
  inUseError,
  unknownError,
} from "../../utils/repository.utils";

export class CategoryRepository {
  static async findAllByUser(
    userId: string,
    includeSystem = true
  ): Promise<Category[]> {
    const whereClause: Prisma.CategoryWhereInput = includeSystem
      ? { OR: [{ userId: null }, { userId }] }
      : { userId };

    return prisma.category.findMany({
      where: whereClause,
      orderBy: [{ userId: "asc" }, { name: "asc" }],
    });
  }

  static async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  static async findSystemCategoryBySlug(
    slug: string
  ): Promise<Category | null> {
    return prisma.category.findFirst({
      where: { slug, userId: null },
    });
  }

  static async findBySlugAndUser(
    slug: string,
    userId: string
  ): Promise<Category | null> {
    return prisma.category.findFirst({
      where: { slug, userId },
    });
  }

  static async create(
    data: Prisma.CategoryCreateInput
  ): Promise<RepositoryResult<Category>> {
    try {
      const category = await prisma.category.create({ data });
      return { success: true, data: category };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION
      ) {
        return duplicateError("Category with this name already exists");
      }
      return unknownError("create category", error);
    }
  }

  static async update(
    id: string,
    data: Prisma.CategoryUpdateInput
  ): Promise<RepositoryResult<Category>> {
    try {
      const category = await prisma.category.update({ where: { id }, data });
      return { success: true, data: category };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("Category");
      }
      return unknownError("update category", error);
    }
  }

  static async delete(id: string): Promise<RepositoryResult<Category>> {
    try {
      const category = await prisma.category.delete({ where: { id } });
      return { success: true, data: category };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
          return notFoundError("Category");
        }
        if (error.code === PRISMA_ERROR.FOREIGN_KEY_CONSTRAINT_VIOLATION) {
          return inUseError(
            "Cannot delete category with transactions or budget allocations"
          );
        }
      }
      return unknownError("delete category", error);
    }
  }

  static async hasTransactions(categoryId: string): Promise<boolean> {
    const count = await prisma.transaction.count({ where: { categoryId } });
    return count > 0;
  }

  static async hasBudgetAllocations(categoryId: string): Promise<boolean> {
    const count = await prisma.budgetAllocation.count({
      where: { categoryId },
    });
    return count > 0;
  }
}
