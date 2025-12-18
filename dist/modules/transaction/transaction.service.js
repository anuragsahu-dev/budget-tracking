"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const transaction_repository_1 = require("./transaction.repository");
const error_middleware_1 = require("../../middlewares/error.middleware");
const logger_1 = __importDefault(require("../../config/logger"));
const prisma_1 = __importDefault(require("../../config/prisma"));
function formatTransaction(t) {
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
async function verifyCategoryAccess(categoryId, userId) {
    const category = await prisma_1.default.category.findUnique({
        where: { id: categoryId },
    });
    if (!category)
        throw new error_middleware_1.ApiError(400, "Category not found");
    if (category.userId && category.userId !== userId) {
        throw new error_middleware_1.ApiError(403, "Access denied to this category");
    }
}
class TransactionService {
    static async getAllTransactions(userId, query) {
        const result = await transaction_repository_1.TransactionRepository.findAllByUser({
            userId,
            type: query.type,
            categoryId: query.categoryId,
            from: query.from,
            to: query.to,
        }, {
            page: query.page,
            limit: query.limit,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
        });
        return {
            transactions: result.data.map(formatTransaction),
            meta: result.meta,
        };
    }
    static async getTransactionById(transactionId, userId) {
        const transaction = await transaction_repository_1.TransactionRepository.findByIdAndUser(transactionId, userId);
        if (!transaction)
            throw new error_middleware_1.ApiError(404, "Transaction not found");
        return formatTransaction(transaction);
    }
    static async createTransaction(userId, data) {
        if (data.categoryId)
            await verifyCategoryAccess(data.categoryId, userId);
        const result = await transaction_repository_1.TransactionRepository.create({
            user: { connect: { id: userId } },
            amount: data.amount,
            type: data.type,
            description: data.description ?? null,
            date: data.date ?? new Date(),
            ...(data.categoryId && {
                category: { connect: { id: data.categoryId } },
            }),
        });
        if (!result.success)
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        logger_1.default.info("Transaction created", {
            userId,
            transactionId: result.data.id,
        });
        return formatTransaction(result.data);
    }
    static async updateTransaction(transactionId, userId, data) {
        const transaction = await transaction_repository_1.TransactionRepository.findByIdAndUser(transactionId, userId);
        if (!transaction)
            throw new error_middleware_1.ApiError(404, "Transaction not found");
        if (data.categoryId)
            await verifyCategoryAccess(data.categoryId, userId);
        const updateData = {};
        if (data.amount !== undefined)
            updateData.amount = data.amount;
        if (data.type !== undefined)
            updateData.type = data.type;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.date !== undefined)
            updateData.date = data.date;
        if (data.categoryId !== undefined) {
            updateData.category =
                data.categoryId === null
                    ? { disconnect: true }
                    : { connect: { id: data.categoryId } };
        }
        if (Object.keys(updateData).length === 0) {
            throw new error_middleware_1.ApiError(400, "No valid fields to update");
        }
        const result = await transaction_repository_1.TransactionRepository.update(transactionId, updateData);
        if (!result.success)
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        logger_1.default.info("Transaction updated", { userId, transactionId });
        return formatTransaction(result.data);
    }
    static async deleteTransaction(transactionId, userId) {
        const transaction = await transaction_repository_1.TransactionRepository.findByIdAndUser(transactionId, userId);
        if (!transaction)
            throw new error_middleware_1.ApiError(404, "Transaction not found");
        const result = await transaction_repository_1.TransactionRepository.delete(transactionId);
        if (!result.success)
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        logger_1.default.info("Transaction deleted", { userId, transactionId });
        return { message: "Transaction deleted successfully" };
    }
    static async getTransactionSummary(userId, from, to) {
        return transaction_repository_1.TransactionRepository.getSummaryByUser(userId, from, to);
    }
}
exports.TransactionService = TransactionService;
