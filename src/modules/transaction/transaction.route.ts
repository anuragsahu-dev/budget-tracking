import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { TransactionController } from "./transaction.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionIdParamSchema,
  listTransactionsQuerySchema,
  transactionSummaryQuerySchema,
} from "./transaction.validation";

const router = Router();

router.use(verifyJWT);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/",
  validate({ query: listTransactionsQuerySchema }),
  TransactionController.getAllTransactions
);

/**
 * @swagger
 * /transactions/summary:
 *   get:
 *     summary: Get transaction summary
 *     tags: [Transactions]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Summary fetched (income, expense, balance)
 *       401:
 *         description: Authentication required
 */
router.get(
  "/summary",
  validate({ query: transactionSummaryQuerySchema }),
  TransactionController.getTransactionSummary
);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
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
 *         description: Transaction fetched successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Transaction not found
 */
router.get(
  "/:id",
  validate({ params: transactionIdParamSchema }),
  TransactionController.getTransactionById
);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a transaction
 *     tags: [Transactions]
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
 *               - amount
 *               - type
 *               - categoryId
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               categoryId:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Transaction created
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 */
router.post(
  "/",
  validate({ body: createTransactionSchema }),
  TransactionController.createTransaction
);

/**
 * @swagger
 * /transactions/{id}:
 *   patch:
 *     summary: Update a transaction
 *     tags: [Transactions]
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
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               categoryId:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Transaction updated
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Transaction not found
 */
router.patch(
  "/:id",
  validate({ params: transactionIdParamSchema, body: updateTransactionSchema }),
  TransactionController.updateTransaction
);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
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
 *         description: Transaction deleted
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Transaction not found
 */
router.delete(
  "/:id",
  validate({ params: transactionIdParamSchema }),
  TransactionController.deleteTransaction
);

export default router;
