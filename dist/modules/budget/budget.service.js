"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetService = void 0;
const budget_repository_1 = require("./budget.repository");
const error_middleware_1 = require("../../middlewares/error.middleware");
const logger_1 = __importDefault(require("../../config/logger"));
const prisma_1 = __importDefault(require("../../config/prisma"));
function formatBudget(budget) {
    const allocations = budget.allocations.map((a) => ({
        id: a.id,
        amount: Number(a.amount),
        category: a.category,
    }));
    return {
        id: budget.id,
        month: budget.month,
        year: budget.year,
        totalLimit: budget.totalLimit ? Number(budget.totalLimit) : null,
        note: budget.note,
        allocations,
        allocatedTotal: allocations.reduce((sum, a) => sum + a.amount, 0),
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt,
    };
}
async function verifyBudgetOwnership(budgetId, userId) {
    const budget = await budget_repository_1.BudgetRepository.findById(budgetId);
    if (!budget)
        throw new error_middleware_1.ApiError(404, "Budget not found");
    if (budget.userId !== userId)
        throw new error_middleware_1.ApiError(403, "Access denied");
    return budget;
}
class BudgetService {
    static async getAllBudgets(userId, query) {
        const result = await budget_repository_1.BudgetRepository.findAllByUser({ userId, month: query.month, year: query.year }, { page: query.page, limit: query.limit });
        return { budgets: result.data.map(formatBudget), meta: result.meta };
    }
    static async getBudgetById(budgetId, userId) {
        const budget = await verifyBudgetOwnership(budgetId, userId);
        return formatBudget(budget);
    }
    static async createBudget(userId, data) {
        const existing = await budget_repository_1.BudgetRepository.findByUserMonthYear(userId, data.month, data.year);
        if (existing) {
            throw new error_middleware_1.ApiError(409, `A budget for ${data.month}/${data.year} already exists`);
        }
        const result = await budget_repository_1.BudgetRepository.create({
            user: { connect: { id: userId } },
            month: data.month,
            year: data.year,
            totalLimit: data.totalLimit ?? null,
            note: data.note ?? null,
        });
        if (!result.success)
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        logger_1.default.info("Budget created", { userId, budgetId: result.data.id });
        return formatBudget(result.data);
    }
    static async updateBudget(budgetId, userId, data) {
        await verifyBudgetOwnership(budgetId, userId);
        const updateData = {};
        if (data.totalLimit !== undefined)
            updateData.totalLimit = data.totalLimit;
        if (data.note !== undefined)
            updateData.note = data.note;
        if (Object.keys(updateData).length === 0) {
            throw new error_middleware_1.ApiError(400, "No valid fields to update");
        }
        const result = await budget_repository_1.BudgetRepository.update(budgetId, updateData);
        if (!result.success)
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        logger_1.default.info("Budget updated", { userId, budgetId });
        return formatBudget(result.data);
    }
    static async deleteBudget(budgetId, userId) {
        await verifyBudgetOwnership(budgetId, userId);
        const result = await budget_repository_1.BudgetRepository.delete(budgetId);
        if (!result.success)
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        logger_1.default.info("Budget deleted", { userId, budgetId });
        return { message: "Budget deleted successfully" };
    }
    static async createAllocation(budgetId, userId, data) {
        await verifyBudgetOwnership(budgetId, userId);
        const category = await prisma_1.default.category.findUnique({
            where: { id: data.categoryId },
        });
        if (!category)
            throw new error_middleware_1.ApiError(400, "Category not found");
        if (category.userId && category.userId !== userId) {
            throw new error_middleware_1.ApiError(403, "Access denied to this category");
        }
        const existing = await budget_repository_1.BudgetRepository.findAllocationByBudgetAndCategory(budgetId, data.categoryId);
        if (existing) {
            throw new error_middleware_1.ApiError(409, "Allocation for this category already exists");
        }
        const result = await budget_repository_1.BudgetRepository.createAllocation({
            budget: { connect: { id: budgetId } },
            category: { connect: { id: data.categoryId } },
            amount: data.amount,
        });
        if (!result.success)
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        logger_1.default.info("Allocation created", {
            userId,
            budgetId,
            allocationId: result.data.id,
        });
        return {
            id: result.data.id,
            budgetId,
            amount: Number(result.data.amount),
            category: result.data.category,
        };
    }
    static async updateAllocation(budgetId, allocationId, userId, data) {
        await verifyBudgetOwnership(budgetId, userId);
        const allocation = await budget_repository_1.BudgetRepository.findAllocationById(allocationId);
        if (!allocation || allocation.budgetId !== budgetId) {
            throw new error_middleware_1.ApiError(404, "Allocation not found");
        }
        const result = await budget_repository_1.BudgetRepository.updateAllocation(allocationId, {
            amount: data.amount,
        });
        if (!result.success)
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        logger_1.default.info("Allocation updated", { userId, budgetId, allocationId });
        return {
            id: result.data.id,
            budgetId,
            amount: Number(result.data.amount),
            category: result.data.category,
        };
    }
    static async deleteAllocation(budgetId, allocationId, userId) {
        await verifyBudgetOwnership(budgetId, userId);
        const allocation = await budget_repository_1.BudgetRepository.findAllocationById(allocationId);
        if (!allocation || allocation.budgetId !== budgetId) {
            throw new error_middleware_1.ApiError(404, "Allocation not found");
        }
        const result = await budget_repository_1.BudgetRepository.deleteAllocation(allocationId);
        if (!result.success)
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        logger_1.default.info("Allocation deleted", { userId, budgetId, allocationId });
        return { message: "Allocation deleted successfully" };
    }
}
exports.BudgetService = BudgetService;
