import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { BudgetController } from "./budget.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";
import {
  createBudgetSchema,
  updateBudgetSchema,
  budgetIdParamSchema,
  listBudgetsQuerySchema,
  budgetAllocationParamsSchema,
  allocationIdParamSchema,
  createAllocationSchema,
  updateAllocationSchema,
} from "./budget.validation";

const router = Router();

router.use(verifyJWT);

// ========== BUDGET ROUTES ==========

/**
 * @route   GET /api/v1/budgets
 * @desc    Get all budgets with optional filters and pagination
 * @access  Private
 * @query   month - 1-12 (optional)
 * @query   year - 2000-2100 (optional)
 * @query   page - number (default: 1)
 * @query   limit - number (default: 12, max: 50)
 */
router.get(
  "/",
  validate({ query: listBudgetsQuerySchema }),
  BudgetController.getAllBudgets
);

/**
 * @route   GET /api/v1/budgets/:id
 * @desc    Get a single budget by ID with allocations
 * @access  Private
 * @param   id - Budget ULID
 */
router.get(
  "/:id",
  validate({ params: budgetIdParamSchema }),
  BudgetController.getBudgetById
);

/**
 * @route   POST /api/v1/budgets
 * @desc    Create a new budget
 * @access  Private
 * @body    month - 1-12 (required)
 * @body    year - 2000-2100 (required)
 * @body    totalLimit - number (optional)
 * @body    note - string (optional, max 500 chars)
 */
router.post(
  "/",
  validate({ body: createBudgetSchema }),
  BudgetController.createBudget
);

/**
 * @route   PATCH /api/v1/budgets/:id
 * @desc    Update a budget
 * @access  Private
 * @param   id - Budget ULID
 * @body    totalLimit - number or null (optional)
 * @body    note - string or null (optional, max 500 chars)
 */
router.patch(
  "/:id",
  validate({ params: budgetIdParamSchema, body: updateBudgetSchema }),
  BudgetController.updateBudget
);

/**
 * @route   DELETE /api/v1/budgets/:id
 * @desc    Delete a budget (cascades to allocations)
 * @access  Private
 * @param   id - Budget ULID
 */
router.delete(
  "/:id",
  validate({ params: budgetIdParamSchema }),
  BudgetController.deleteBudget
);

// ========== BUDGET ALLOCATION ROUTES ==========

/**
 * @route   POST /api/v1/budgets/:budgetId/allocations
 * @desc    Create a budget allocation for a category
 * @access  Private
 * @param   budgetId - Budget ULID
 * @body    categoryId - Category ULID (required)
 * @body    amount - number (required, positive)
 */
router.post(
  "/:budgetId/allocations",
  validate({
    params: budgetAllocationParamsSchema,
    body: createAllocationSchema,
  }),
  BudgetController.createAllocation
);

/**
 * @route   PATCH /api/v1/budgets/:budgetId/allocations/:id
 * @desc    Update a budget allocation amount
 * @access  Private
 * @param   budgetId - Budget ULID
 * @param   id - Allocation ULID
 * @body    amount - number (required, positive)
 */
router.patch(
  "/:budgetId/allocations/:id",
  validate({ params: allocationIdParamSchema, body: updateAllocationSchema }),
  BudgetController.updateAllocation
);

/**
 * @route   DELETE /api/v1/budgets/:budgetId/allocations/:id
 * @desc    Delete a budget allocation
 * @access  Private
 * @param   budgetId - Budget ULID
 * @param   id - Allocation ULID
 */
router.delete(
  "/:budgetId/allocations/:id",
  validate({ params: allocationIdParamSchema }),
  BudgetController.deleteAllocation
);

export default router;
