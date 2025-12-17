import { asyncHandler } from "../../utils/asyncHandler";
import type { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { sendApiResponse } from "../../utils/apiResponse";
import {
  getValidatedBody,
  getValidatedParams,
  getValidatedQuery,
} from "../../types/express";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionIdParam,
  ListTransactionsQuery,
  TransactionSummaryQuery,
} from "./transaction.validation";

export const TransactionController = {
  getAllTransactions: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const query = getValidatedQuery<ListTransactionsQuery>(req);

    const result = await TransactionService.getAllTransactions(userId, query);

    return sendApiResponse(
      res,
      200,
      "Transactions fetched successfully",
      result.transactions,
      result.meta
    );
  }),

  getTransactionById: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { id } = getValidatedParams<TransactionIdParam>(req);

    const transaction = await TransactionService.getTransactionById(id, userId);

    return sendApiResponse(
      res,
      200,
      "Transaction fetched successfully",
      transaction
    );
  }),

  createTransaction: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const data = getValidatedBody<CreateTransactionInput>(req);

    const transaction = await TransactionService.createTransaction(
      userId,
      data
    );

    return sendApiResponse(
      res,
      201,
      "Transaction created successfully",
      transaction
    );
  }),

  updateTransaction: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { id } = getValidatedParams<TransactionIdParam>(req);
    const data = getValidatedBody<UpdateTransactionInput>(req);

    const transaction = await TransactionService.updateTransaction(
      id,
      userId,
      data
    );

    return sendApiResponse(
      res,
      200,
      "Transaction updated successfully",
      transaction
    );
  }),

  deleteTransaction: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { id } = getValidatedParams<TransactionIdParam>(req);

    const result = await TransactionService.deleteTransaction(id, userId);

    return sendApiResponse(res, 200, result.message, null);
  }),

  getTransactionSummary: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { from, to } = getValidatedQuery<TransactionSummaryQuery>(req);

    const summary = await TransactionService.getTransactionSummary(
      userId,
      from,
      to
    );

    return sendApiResponse(
      res,
      200,
      "Transaction summary fetched successfully",
      summary
    );
  }),
};
