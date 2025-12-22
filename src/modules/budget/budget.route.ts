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
 * @swagger
 * /budgets:
 *   get:
 *     summary: Get all budgets
 *     tags: [Budgets]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Budgets fetched successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/",
  validate({ query: listBudgetsQuerySchema }),
  BudgetController.getAllBudgets
);

/**
 * @swagger
 * /budgets/{id}:
 *   get:
 *     summary: Get budget by ID with allocations
 *     tags: [Budgets]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Budget fetched successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Budget not found
 */
router.get(
  "/:id",
  validate({ params: budgetIdParamSchema }),
  BudgetController.getBudgetById
);

/**
 * @swagger
 * /budgets:
 *   post:
 *     summary: Create a budget
 *     tags: [Budgets]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *               - year
 *             properties:
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               year:
 *                 type: integer
 *               totalLimit:
 *                 type: number
 *               note:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Budget created
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 *       409:
 *         description: Budget already exists for this month/year
 */
router.post(
  "/",
  validate({ body: createBudgetSchema }),
  BudgetController.createBudget
);

/**
 * @swagger
 * /budgets/{id}:
 *   patch:
 *     summary: Update a budget
 *     tags: [Budgets]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalLimit:
 *                 type: number
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Budget updated
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Budget not found
 */
router.patch(
  "/:id",
  validate({ params: budgetIdParamSchema, body: updateBudgetSchema }),
  BudgetController.updateBudget
);

/**
 * @swagger
 * /budgets/{id}:
 *   delete:
 *     summary: Delete a budget
 *     tags: [Budgets]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Budget deleted
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Budget not found
 */
router.delete(
  "/:id",
  validate({ params: budgetIdParamSchema }),
  BudgetController.deleteBudget
);

// ========== BUDGET ALLOCATION ROUTES ==========

/**
 * @swagger
 * /budgets/{budgetId}/allocations:
 *   post:
 *     summary: Create a budget allocation
 *     tags: [Budgets]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: budgetId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *               - amount
 *             properties:
 *               categoryId:
 *                 type: string
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *     responses:
 *       201:
 *         description: Allocation created
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Budget or category not found
 *       409:
 *         description: Allocation already exists
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
 * @swagger
 * /budgets/{budgetId}/allocations/{id}:
 *   patch:
 *     summary: Update allocation amount
 *     tags: [Budgets]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: budgetId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *     responses:
 *       200:
 *         description: Allocation updated
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Allocation not found
 */
router.patch(
  "/:budgetId/allocations/:id",
  validate({ params: allocationIdParamSchema, body: updateAllocationSchema }),
  BudgetController.updateAllocation
);

/**
 * @swagger
 * /budgets/{budgetId}/allocations/{id}:
 *   delete:
 *     summary: Delete an allocation
 *     tags: [Budgets]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: budgetId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Allocation deleted
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Allocation not found
 */
router.delete(
  "/:budgetId/allocations/:id",
  validate({ params: allocationIdParamSchema }),
  BudgetController.deleteAllocation
);

export default router;
