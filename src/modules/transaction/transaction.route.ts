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

router.get(
  "/",
  verifyJWT,
  validate({ query: listTransactionsQuerySchema }),
  TransactionController.getAllTransactions
);

router.get(
  "/summary",
  verifyJWT,
  validate({ query: transactionSummaryQuerySchema }),
  TransactionController.getTransactionSummary
);

router.get(
  "/:id",
  verifyJWT,
  validate({ params: transactionIdParamSchema }),
  TransactionController.getTransactionById
);

router.post(
  "/",
  verifyJWT,
  validate({ body: createTransactionSchema }),
  TransactionController.createTransaction
);

router.patch(
  "/:id",
  verifyJWT,
  validate({ params: transactionIdParamSchema, body: updateTransactionSchema }),
  TransactionController.updateTransaction
);

router.delete(
  "/:id",
  verifyJWT,
  validate({ params: transactionIdParamSchema }),
  TransactionController.deleteTransaction
);

export default router;
