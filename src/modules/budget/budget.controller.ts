import { asyncHandler } from "../../utils/asyncHandler";
import type { Request, Response } from "express";
import { BudgetService } from "./budget.service";
import { sendApiResponse } from "../../utils/apiResponse";
import {
  getValidatedBody,
  getValidatedParams,
  getValidatedQuery,
} from "../../types/express";
import type {
  CreateBudgetInput,
  UpdateBudgetInput,
  BudgetIdParam,
  ListBudgetsQuery,
  BudgetAllocationParams,
  AllocationIdParam,
  CreateAllocationInput,
  UpdateAllocationInput,
} from "./budget.validation";

export const BudgetController = {
  // ========== BUDGET ENDPOINTS ==========

  getAllBudgets: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const query = getValidatedQuery<ListBudgetsQuery>(req);

    const result = await BudgetService.getAllBudgets(userId, query);

    return sendApiResponse(
      res,
      200,
      "Budgets fetched successfully",
      result.budgets,
      result.meta
    );
  }),

  getBudgetById: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { id } = getValidatedParams<BudgetIdParam>(req);

    const budget = await BudgetService.getBudgetById(id, userId);

    return sendApiResponse(res, 200, "Budget fetched successfully", budget);
  }),

  createBudget: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const data = getValidatedBody<CreateBudgetInput>(req);

    const budget = await BudgetService.createBudget(userId, data);

    return sendApiResponse(res, 201, "Budget created successfully", budget);
  }),

  updateBudget: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { id } = getValidatedParams<BudgetIdParam>(req);
    const data = getValidatedBody<UpdateBudgetInput>(req);

    const budget = await BudgetService.updateBudget(id, userId, data);

    return sendApiResponse(res, 200, "Budget updated successfully", budget);
  }),

  deleteBudget: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { id } = getValidatedParams<BudgetIdParam>(req);

    const result = await BudgetService.deleteBudget(id, userId);

    return sendApiResponse(res, 200, result.message, null);
  }),

  // ========== BUDGET ALLOCATION ENDPOINTS ==========

  createAllocation: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { budgetId } = getValidatedParams<BudgetAllocationParams>(req);
    const data = getValidatedBody<CreateAllocationInput>(req);

    const allocation = await BudgetService.createAllocation(
      budgetId,
      userId,
      data
    );

    return sendApiResponse(
      res,
      201,
      "Allocation created successfully",
      allocation
    );
  }),

  updateAllocation: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { budgetId, id } = getValidatedParams<AllocationIdParam>(req);
    const data = getValidatedBody<UpdateAllocationInput>(req);

    const allocation = await BudgetService.updateAllocation(
      budgetId,
      id,
      userId,
      data
    );

    return sendApiResponse(
      res,
      200,
      "Allocation updated successfully",
      allocation
    );
  }),

  deleteAllocation: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { budgetId, id } = getValidatedParams<AllocationIdParam>(req);

    const result = await BudgetService.deleteAllocation(budgetId, id, userId);

    return sendApiResponse(res, 200, result.message, null);
  }),
};
