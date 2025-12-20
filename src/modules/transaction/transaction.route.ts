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

router.get(
  "/",
  validate({ query: listTransactionsQuerySchema }),
  TransactionController.getAllTransactions
);

router.get(
  "/summary",
  validate({ query: transactionSummaryQuerySchema }),
  TransactionController.getTransactionSummary
);

router.get(
  "/:id",
  validate({ params: transactionIdParamSchema }),
  TransactionController.getTransactionById
);

router.post(
  "/",
  validate({ body: createTransactionSchema }),
  TransactionController.createTransaction
);

router.patch(
  "/:id",
  validate({ params: transactionIdParamSchema, body: updateTransactionSchema }),
  TransactionController.updateTransaction
);

router.delete(
  "/:id",
  validate({ params: transactionIdParamSchema }),
  TransactionController.deleteTransaction
);

export default router;
