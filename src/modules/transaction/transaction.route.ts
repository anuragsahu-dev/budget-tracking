import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { TransactionController } from "./transaction.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionIdParamSchema,
  listTransactionsQuerySchema,
} from "./transaction.validation";

const router = Router();

/**
 * @route   GET /api/v1/transactions
 * @desc    Get all transactions with filters and pagination
 * @access  Private
 * @query   type - "INCOME" | "EXPENSE" (optional)
 * @query   categoryId - ULID (optional)
 * @query   from - ISO date string (optional)
 * @query   to - ISO date string (optional)
 * @query   page - number (default: 1)
 * @query   limit - number (default: 20, max: 100)
 * @query   sortBy - "date" | "amount" | "createdAt" (default: "date")
 * @query   sortOrder - "asc" | "desc" (default: "desc")
 */
router.get(
  "/",
  verifyJWT,
  validate({ query: listTransactionsQuerySchema }),
  TransactionController.getAllTransactions
);

/**
 * @route   GET /api/v1/transactions/:id
 * @desc    Get a single transaction by ID
 * @access  Private
 * @param   id - Transaction ULID
 */
router.get(
  "/:id",
  verifyJWT,
  validate({ params: transactionIdParamSchema }),
  TransactionController.getTransactionById
);

/**
 * @route   POST /api/v1/transactions
 * @desc    Create a new transaction
 * @access  Private
 * @body    amount - number (required, positive)
 * @body    type - "INCOME" | "EXPENSE" (required)
 * @body    categoryId - ULID (optional)
 * @body    description - string (optional, max 500 chars)
 * @body    date - ISO date string (optional, defaults to now)
 */
router.post(
  "/",
  verifyJWT,
  validate({ body: createTransactionSchema }),
  TransactionController.createTransaction
);

/**
 * @route   PATCH /api/v1/transactions/:id
 * @desc    Update a transaction
 * @access  Private
 * @param   id - Transaction ULID
 * @body    amount - number (optional, positive)
 * @body    type - "INCOME" | "EXPENSE" (optional)
 * @body    categoryId - ULID or null (optional)
 * @body    description - string or null (optional, max 500 chars)
 * @body    date - ISO date string (optional)
 */
router.patch(
  "/:id",
  verifyJWT,
  validate({ params: transactionIdParamSchema, body: updateTransactionSchema }),
  TransactionController.updateTransaction
);

/**
 * @route   DELETE /api/v1/transactions/:id
 * @desc    Delete a transaction
 * @access  Private
 * @param   id - Transaction ULID
 */
router.delete(
  "/:id",
  verifyJWT,
  validate({ params: transactionIdParamSchema }),
  TransactionController.deleteTransaction
);

export default router;
