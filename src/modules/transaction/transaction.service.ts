import {
  TransactionRepository,
  TransactionWithCategory,
} from "./transaction.repository";
import { ApiError } from "../../middlewares/error.middleware";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  ListTransactionsQuery,
} from "./transaction.validation";
import logger from "../../config/logger";
import prisma from "../../config/prisma";

function formatTransaction(t: TransactionWithCategory) {
  return {
    id: t.id,
    amount: Number(t.amount),
    type: t.type,
    description: t.description,
    date: t.date,
    category: t.category,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

async function verifyCategoryAccess(categoryId: string, userId: string) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) throw new ApiError(400, "Category not found");
  if (category.userId && category.userId !== userId) {
    throw new ApiError(403, "Access denied to this category");
  }
}

export class TransactionService {
  static async getAllTransactions(
    userId: string,
    query: ListTransactionsQuery
  ) {
    const result = await TransactionRepository.findAllByUser(
      {
        userId,
        type: query.type,
        categoryId: query.categoryId,
        from: query.from,
        to: query.to,
      },
      {
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      }
    );
    return {
      transactions: result.data.map(formatTransaction),
      meta: result.meta,
    };
  }

  static async getTransactionById(transactionId: string, userId: string) {
    const transaction = await TransactionRepository.findByIdAndUser(
      transactionId,
      userId
    );
    if (!transaction) throw new ApiError(404, "Transaction not found");
    return formatTransaction(transaction);
  }

  static async createTransaction(userId: string, data: CreateTransactionInput) {
    if (data.categoryId) await verifyCategoryAccess(data.categoryId, userId);

    const result = await TransactionRepository.create({
      user: { connect: { id: userId } },
      amount: data.amount,
      type: data.type,
      description: data.description ?? null,
      date: data.date ?? new Date(),
      ...(data.categoryId && {
        category: { connect: { id: data.categoryId } },
      }),
    });

    if (!result.success) throw new ApiError(result.statusCode, result.message);

    logger.info("Transaction created", {
      userId,
      transactionId: result.data.id,
    });
    return formatTransaction(result.data);
  }

  static async updateTransaction(
    transactionId: string,
    userId: string,
    data: UpdateTransactionInput
  ) {
    const transaction = await TransactionRepository.findByIdAndUser(
      transactionId,
      userId
    );
    if (!transaction) throw new ApiError(404, "Transaction not found");

    if (data.categoryId) await verifyCategoryAccess(data.categoryId, userId);

    type UpdateData = {
      amount?: number;
      type?: "INCOME" | "EXPENSE";
      description?: string | null;
      date?: Date;
      category?: { connect: { id: string } } | { disconnect: true };
    };

    const updateData: UpdateData = {};
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.date !== undefined) updateData.date = data.date;
    if (data.categoryId !== undefined) {
      updateData.category =
        data.categoryId === null
          ? { disconnect: true }
          : { connect: { id: data.categoryId } };
    }

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, "No valid fields to update");
    }

    const result = await TransactionRepository.update(
      transactionId,
      updateData
    );
    if (!result.success) throw new ApiError(result.statusCode, result.message);

    logger.info("Transaction updated", { userId, transactionId });
    return formatTransaction(result.data);
  }

  static async deleteTransaction(transactionId: string, userId: string) {
    const transaction = await TransactionRepository.findByIdAndUser(
      transactionId,
      userId
    );
    if (!transaction) throw new ApiError(404, "Transaction not found");

    const result = await TransactionRepository.delete(transactionId);
    if (!result.success) throw new ApiError(result.statusCode, result.message);

    logger.info("Transaction deleted", { userId, transactionId });
    return { message: "Transaction deleted successfully" };
  }

  static async getTransactionSummary(userId: string, from?: Date, to?: Date) {
    return TransactionRepository.getSummaryByUser(userId, from, to);
  }
}
