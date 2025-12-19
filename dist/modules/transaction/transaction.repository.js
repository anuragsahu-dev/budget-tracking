"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("../../generated/prisma/client");
const repository_utils_1 = require("../../utils/repository.utils");
const CATEGORY_SELECT = {
    id: true,
    name: true,
    slug: true,
    color: true,
};
function invalidCategoryError() {
    return {
        success: false,
        error: "INVALID_REFERENCE",
        statusCode: 400,
        message: "Invalid category ID provided",
    };
}
class TransactionRepository {
    static async findAllByUser(filters, pagination) {
        const { userId, type, categoryId, from, to } = filters;
        const { page, limit, sortBy, sortOrder } = pagination;
        const whereClause = {
            userId,
            ...(type && { type }),
            ...(categoryId && { categoryId }),
            ...(from || to
                ? { date: { ...(from && { gte: from }), ...(to && { lte: to }) } }
                : {}),
        };
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            prisma_1.default.transaction.findMany({
                where: whereClause,
                include: { category: { select: CATEGORY_SELECT } },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            prisma_1.default.transaction.count({ where: whereClause }),
        ]);
        return {
            data: transactions,
            meta: (0, repository_utils_1.createPaginationMeta)(total, page, limit),
        };
    }
    static async findById(id) {
        return prisma_1.default.transaction.findUnique({
            where: { id },
            include: { category: { select: CATEGORY_SELECT } },
        });
    }
    static async findByIdAndUser(id, userId) {
        return prisma_1.default.transaction.findFirst({
            where: { id, userId },
            include: { category: { select: CATEGORY_SELECT } },
        });
    }
    static async create(data) {
        try {
            const transaction = await prisma_1.default.transaction.create({
                data,
                include: { category: { select: CATEGORY_SELECT } },
            });
            return { success: true, data: transaction };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.FOREIGN_KEY_CONSTRAINT_VIOLATION) {
                return invalidCategoryError();
            }
            return (0, repository_utils_1.unknownError)("Failed to create transaction", error);
        }
    }
    static async update(id, data) {
        try {
            const transaction = await prisma_1.default.transaction.update({
                where: { id },
                data,
                include: { category: { select: CATEGORY_SELECT } },
            });
            return { success: true, data: transaction };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error)) {
                if (error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                    return (0, repository_utils_1.notFoundError)("Transaction not found");
                }
                if (error.code === repository_utils_1.PRISMA_ERROR.FOREIGN_KEY_CONSTRAINT_VIOLATION) {
                    return invalidCategoryError();
                }
            }
            return (0, repository_utils_1.unknownError)("Failed to update transaction", error);
        }
    }
    static async delete(id) {
        try {
            const transaction = await prisma_1.default.transaction.delete({ where: { id } });
            return { success: true, data: transaction };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                return (0, repository_utils_1.notFoundError)("Transaction not found");
            }
            return (0, repository_utils_1.unknownError)("Failed to delete transaction", error);
        }
    }
    static async getSummaryByUser(userId, from, to) {
        const whereClause = {
            userId,
            ...(from || to
                ? { date: { ...(from && { gte: from }), ...(to && { lte: to }) } }
                : {}),
        };
        const [incomeResult, expenseResult] = await Promise.all([
            prisma_1.default.transaction.aggregate({
                where: { ...whereClause, type: client_1.TransactionType.INCOME },
                _sum: { amount: true },
            }),
            prisma_1.default.transaction.aggregate({
                where: { ...whereClause, type: client_1.TransactionType.EXPENSE },
                _sum: { amount: true },
            }),
        ]);
        const totalIncome = Number(incomeResult._sum.amount ?? 0);
        const totalExpense = Number(expenseResult._sum.amount ?? 0);
        return {
            totalIncome,
            totalExpense,
            netBalance: totalIncome - totalExpense,
        };
    }
}
exports.TransactionRepository = TransactionRepository;
