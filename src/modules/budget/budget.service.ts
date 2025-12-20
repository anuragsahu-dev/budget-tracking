import { BudgetRepository, BudgetWithAllocations } from "./budget.repository";
import { ApiError } from "../../middlewares/error.middleware";
import type {
  CreateBudgetInput,
  UpdateBudgetInput,
  ListBudgetsQuery,
  CreateAllocationInput,
  UpdateAllocationInput,
} from "./budget.validation";
import logger from "../../config/logger";
import prisma from "../../config/prisma";

// Summary format for list endpoints - minimal data
function formatBudgetSummary(budget: BudgetWithAllocations) {
  const allocatedTotal = budget.allocations.reduce(
    (sum, a) => sum + Number(a.amount),
    0
  );

  return {
    id: budget.id,
    month: budget.month,
    year: budget.year,
    totalLimit: budget.totalLimit ? Number(budget.totalLimit) : null,
    allocatedTotal,
    allocationCount: budget.allocations.length,
  };
}

// Detailed format for single budget endpoint - complete data
function formatBudgetDetail(budget: BudgetWithAllocations) {
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

async function verifyBudgetOwnership(budgetId: string, userId: string) {
  const budget = await BudgetRepository.findById(budgetId);
  if (!budget) throw new ApiError(404, "Budget not found");
  if (budget.userId !== userId) throw new ApiError(403, "Access denied");
  return budget;
}

export class BudgetService {
  static async getAllBudgets(userId: string, query: ListBudgetsQuery) {
    const result = await BudgetRepository.findAllByUser(
      { userId, month: query.month, year: query.year },
      { page: query.page, limit: query.limit }
    );
    return { budgets: result.data.map(formatBudgetSummary), meta: result.meta };
  }

  static async getBudgetById(budgetId: string, userId: string) {
    const budget = await verifyBudgetOwnership(budgetId, userId);
    return formatBudgetDetail(budget);
  }

  static async createBudget(userId: string, data: CreateBudgetInput) {
    const existing = await BudgetRepository.findByUserMonthYear(
      userId,
      data.month,
      data.year
    );
    if (existing) {
      throw new ApiError(
        409,
        `A budget for ${data.month}/${data.year} already exists`
      );
    }

    const result = await BudgetRepository.create({
      user: { connect: { id: userId } },
      month: data.month,
      year: data.year,
      totalLimit: data.totalLimit ?? null,
      note: data.note ?? null,
    });

    if (!result.success) throw new ApiError(result.statusCode, result.message);

    logger.info("Budget created", { userId, budgetId: result.data.id });
    return formatBudgetDetail(result.data);
  }

  static async updateBudget(
    budgetId: string,
    userId: string,
    data: UpdateBudgetInput
  ) {
    await verifyBudgetOwnership(budgetId, userId);

    const updateData: { totalLimit?: number | null; note?: string | null } = {};
    if (data.totalLimit !== undefined) updateData.totalLimit = data.totalLimit;
    if (data.note !== undefined) updateData.note = data.note;

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, "No valid fields to update");
    }

    const result = await BudgetRepository.update(budgetId, updateData);
    if (!result.success) throw new ApiError(result.statusCode, result.message);

    logger.info("Budget updated", { userId, budgetId });
    return formatBudgetDetail(result.data);
  }

  static async deleteBudget(budgetId: string, userId: string) {
    await verifyBudgetOwnership(budgetId, userId);

    const result = await BudgetRepository.delete(budgetId);
    if (!result.success) throw new ApiError(result.statusCode, result.message);

    logger.info("Budget deleted", { userId, budgetId });
    return { message: "Budget deleted successfully" };
  }

  // ========== ALLOCATIONS ==========

  static async createAllocation(
    budgetId: string,
    userId: string,
    data: CreateAllocationInput
  ) {
    await verifyBudgetOwnership(budgetId, userId);

    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw new ApiError(400, "Category not found");
    if (category.userId && category.userId !== userId) {
      throw new ApiError(403, "Access denied to this category");
    }

    const existing = await BudgetRepository.findAllocationByBudgetAndCategory(
      budgetId,
      data.categoryId
    );
    if (existing) {
      throw new ApiError(409, "Allocation for this category already exists");
    }

    const result = await BudgetRepository.createAllocation({
      budget: { connect: { id: budgetId } },
      category: { connect: { id: data.categoryId } },
      amount: data.amount,
    });

    if (!result.success) throw new ApiError(result.statusCode, result.message);

    logger.info("Allocation created", {
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

  static async updateAllocation(
    budgetId: string,
    allocationId: string,
    userId: string,
    data: UpdateAllocationInput
  ) {
    await verifyBudgetOwnership(budgetId, userId);

    const allocation = await BudgetRepository.findAllocationById(allocationId);
    if (!allocation || allocation.budgetId !== budgetId) {
      throw new ApiError(404, "Allocation not found");
    }

    const result = await BudgetRepository.updateAllocation(allocationId, {
      amount: data.amount,
    });
    if (!result.success) throw new ApiError(result.statusCode, result.message);

    logger.info("Allocation updated", { userId, budgetId, allocationId });
    return {
      id: result.data.id,
      budgetId,
      amount: Number(result.data.amount),
      category: result.data.category,
    };
  }

  static async deleteAllocation(
    budgetId: string,
    allocationId: string,
    userId: string
  ) {
    await verifyBudgetOwnership(budgetId, userId);

    const allocation = await BudgetRepository.findAllocationById(allocationId);
    if (!allocation || allocation.budgetId !== budgetId) {
      throw new ApiError(404, "Allocation not found");
    }

    const result = await BudgetRepository.deleteAllocation(allocationId);
    if (!result.success) throw new ApiError(result.statusCode, result.message);

    logger.info("Allocation deleted", { userId, budgetId, allocationId });
    return { message: "Allocation deleted successfully" };
  }
}
