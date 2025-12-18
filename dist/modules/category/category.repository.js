"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const repository_utils_1 = require("../../utils/repository.utils");
class CategoryRepository {
    static async findAllByUser(userId, includeSystem = true) {
        const whereClause = includeSystem
            ? { OR: [{ userId: null }, { userId }] }
            : { userId };
        return prisma_1.default.category.findMany({
            where: whereClause,
            orderBy: [{ userId: "asc" }, { name: "asc" }],
        });
    }
    static async findById(id) {
        return prisma_1.default.category.findUnique({ where: { id } });
    }
    static async findSystemCategoryBySlug(slug) {
        return prisma_1.default.category.findFirst({
            where: { slug, userId: null },
        });
    }
    static async findBySlugAndUser(slug, userId) {
        return prisma_1.default.category.findFirst({
            where: { slug, userId },
        });
    }
    static async create(data) {
        try {
            const category = await prisma_1.default.category.create({ data });
            return { success: true, data: category };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
                return (0, repository_utils_1.duplicateError)("Category with this name already exists");
            }
            return (0, repository_utils_1.unknownError)("Failed to create category", error);
        }
    }
    static async update(id, data) {
        try {
            const category = await prisma_1.default.category.update({ where: { id }, data });
            return { success: true, data: category };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                return (0, repository_utils_1.notFoundError)("Category not found");
            }
            return (0, repository_utils_1.unknownError)("Failed to update category", error);
        }
    }
    static async delete(id) {
        try {
            const category = await prisma_1.default.category.delete({ where: { id } });
            return { success: true, data: category };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error)) {
                if (error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                    return (0, repository_utils_1.notFoundError)("Category not found");
                }
                if (error.code === repository_utils_1.PRISMA_ERROR.FOREIGN_KEY_CONSTRAINT_VIOLATION) {
                    return (0, repository_utils_1.inUseError)("Cannot delete category with transactions or budget allocations");
                }
            }
            return (0, repository_utils_1.unknownError)("Failed to delete category", error);
        }
    }
    static async hasTransactions(categoryId) {
        const count = await prisma_1.default.transaction.count({ where: { categoryId } });
        return count > 0;
    }
    static async hasBudgetAllocations(categoryId) {
        const count = await prisma_1.default.budgetAllocation.count({
            where: { categoryId },
        });
        return count > 0;
    }
}
exports.CategoryRepository = CategoryRepository;
