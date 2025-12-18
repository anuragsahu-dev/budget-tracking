"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const repository_utils_1 = require("../../utils/repository.utils");
const CATEGORY_SELECT = {
    id: true,
    name: true,
    slug: true,
    color: true,
};
const ALLOCATIONS_INCLUDE = {
    allocations: {
        include: {
            category: { select: CATEGORY_SELECT },
        },
    },
};
function invalidCategoryError() {
    return {
        success: false,
        error: "INVALID_REFERENCE",
        statusCode: 400,
        message: "Invalid category ID provided",
    };
}
class BudgetRepository {
    static async findAllByUser(filters, pagination) {
        const { userId, month, year } = filters;
        const { page, limit } = pagination;
        const whereClause = {
            userId,
            ...(month && { month }),
            ...(year && { year }),
        };
        const skip = (page - 1) * limit;
        const [budgets, total] = await Promise.all([
            prisma_1.default.budget.findMany({
                where: whereClause,
                include: ALLOCATIONS_INCLUDE,
                orderBy: [{ year: "desc" }, { month: "desc" }],
                skip,
                take: limit,
            }),
            prisma_1.default.budget.count({ where: whereClause }),
        ]);
        return { data: budgets, meta: (0, repository_utils_1.createPaginationMeta)(total, page, limit) };
    }
    static async findById(id) {
        return prisma_1.default.budget.findUnique({
            where: { id },
            include: ALLOCATIONS_INCLUDE,
        });
    }
    static async findByUserMonthYear(userId, month, year) {
        return prisma_1.default.budget.findUnique({
            where: { userId_month_year: { userId, month, year } },
        });
    }
    static async create(data) {
        try {
            const budget = await prisma_1.default.budget.create({
                data,
                include: ALLOCATIONS_INCLUDE,
            });
            return { success: true, data: budget };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
                return (0, repository_utils_1.duplicateError)("A budget for this month and year already exists");
            }
            return (0, repository_utils_1.unknownError)("Failed to create budget", error);
        }
    }
    static async update(id, data) {
        try {
            const budget = await prisma_1.default.budget.update({
                where: { id },
                data,
                include: ALLOCATIONS_INCLUDE,
            });
            return { success: true, data: budget };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                return (0, repository_utils_1.notFoundError)("Budget not found");
            }
            return (0, repository_utils_1.unknownError)("Failed to update budget", error);
        }
    }
    static async delete(id) {
        try {
            const budget = await prisma_1.default.budget.delete({ where: { id } });
            return { success: true, data: budget };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                return (0, repository_utils_1.notFoundError)("Budget not found");
            }
            return (0, repository_utils_1.unknownError)("Failed to delete budget", error);
        }
    }
    static async findAllocationById(id) {
        return prisma_1.default.budgetAllocation.findUnique({
            where: { id },
            include: { category: { select: CATEGORY_SELECT } },
        });
    }
    static async findAllocationByBudgetAndCategory(budgetId, categoryId) {
        return prisma_1.default.budgetAllocation.findUnique({
            where: { budgetId_categoryId: { budgetId, categoryId } },
        });
    }
    static async createAllocation(data) {
        try {
            const allocation = await prisma_1.default.budgetAllocation.create({
                data,
                include: { category: { select: CATEGORY_SELECT } },
            });
            return { success: true, data: allocation };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error)) {
                if (error.code === repository_utils_1.PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
                    return (0, repository_utils_1.duplicateError)("An allocation for this category already exists in this budget");
                }
                if (error.code === repository_utils_1.PRISMA_ERROR.FOREIGN_KEY_CONSTRAINT_VIOLATION) {
                    return invalidCategoryError();
                }
            }
            return (0, repository_utils_1.unknownError)("Failed to create budget allocation", error);
        }
    }
    static async updateAllocation(id, data) {
        try {
            const allocation = await prisma_1.default.budgetAllocation.update({
                where: { id },
                data,
                include: { category: { select: CATEGORY_SELECT } },
            });
            return { success: true, data: allocation };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                return (0, repository_utils_1.notFoundError)("Budget allocation not found");
            }
            return (0, repository_utils_1.unknownError)("Failed to update budget allocation", error);
        }
    }
    static async deleteAllocation(id) {
        try {
            const allocation = await prisma_1.default.budgetAllocation.delete({
                where: { id },
            });
            return { success: true, data: allocation };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                return (0, repository_utils_1.notFoundError)("Budget allocation not found");
            }
            return (0, repository_utils_1.unknownError)("Failed to delete budget allocation", error);
        }
    }
}
exports.BudgetRepository = BudgetRepository;
