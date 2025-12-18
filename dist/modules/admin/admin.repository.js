"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("../../generated/prisma/client");
const repository_utils_1 = require("../../utils/repository.utils");
const category_repository_1 = require("../category/category.repository");
const SAFE_USER_SELECT = {
    id: true,
    email: true,
    fullName: true,
    isEmailVerified: true,
    googleId: true,
    currency: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
};
class AdminRepository {
    static async findAllSystemCategories() {
        return prisma_1.default.category.findMany({
            where: { userId: null },
            orderBy: { name: "asc" },
        });
    }
    static async findSystemCategoryById(id) {
        return prisma_1.default.category.findFirst({
            where: { id, userId: null },
        });
    }
    static async createSystemCategory(data) {
        try {
            const category = await prisma_1.default.category.create({
                data: { ...data, userId: null },
            });
            return { success: true, data: category };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
                return (0, repository_utils_1.duplicateError)("A system category with this name already exists");
            }
            return (0, repository_utils_1.unknownError)("Failed to create system category", error);
        }
    }
    static async updateSystemCategory(id, data) {
        try {
            const category = await prisma_1.default.category.update({ where: { id }, data });
            return { success: true, data: category };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error)) {
                if (error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                    return (0, repository_utils_1.notFoundError)("System category not found");
                }
                if (error.code === repository_utils_1.PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
                    return (0, repository_utils_1.duplicateError)("A system category with this name already exists");
                }
            }
            return (0, repository_utils_1.unknownError)("Failed to update system category", error);
        }
    }
    static async deleteSystemCategory(id) {
        try {
            const category = await prisma_1.default.category.delete({ where: { id } });
            return { success: true, data: category };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error)) {
                if (error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                    return (0, repository_utils_1.notFoundError)("System category not found");
                }
                if (error.code === repository_utils_1.PRISMA_ERROR.FOREIGN_KEY_CONSTRAINT_VIOLATION) {
                    return (0, repository_utils_1.inUseError)("Cannot delete category in use by transactions or allocations");
                }
            }
            return (0, repository_utils_1.unknownError)("Failed to delete system category", error);
        }
    }
    static async findAllUsers(filters, pagination) {
        const { role, status, search } = filters;
        const { page, limit, sortBy, sortOrder } = pagination;
        const whereClause = {
            ...(role && { role }),
            ...(status && { status }),
            ...(search && {
                OR: [
                    { email: { contains: search, mode: "insensitive" } },
                    { fullName: { contains: search, mode: "insensitive" } },
                ],
            }),
        };
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where: whereClause,
                select: SAFE_USER_SELECT,
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            prisma_1.default.user.count({ where: whereClause }),
        ]);
        return {
            data: users,
            meta: (0, repository_utils_1.createPaginationMeta)(total, page, limit),
        };
    }
    static async findUserById(id) {
        return prisma_1.default.user.findUnique({
            where: { id },
            select: SAFE_USER_SELECT,
        });
    }
    static async updateUserStatus(id, status) {
        try {
            const user = await prisma_1.default.user.update({
                where: { id },
                data: { status },
                select: SAFE_USER_SELECT,
            });
            return { success: true, data: user };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                return (0, repository_utils_1.notFoundError)("User not found");
            }
            return (0, repository_utils_1.unknownError)("Failed to update user status", error);
        }
    }
    static async getStats(from, to) {
        const dateFilter = from || to
            ? { createdAt: { ...(from && { gte: from }), ...(to && { lte: to }) } }
            : {};
        const [totalUsers, activeUsers, newUsers, totalTransactions, totalBudgets] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.user.count({ where: { status: client_1.UserStatus.ACTIVE } }),
            prisma_1.default.user.count({ where: dateFilter }),
            prisma_1.default.transaction.count({ where: dateFilter }),
            prisma_1.default.budget.count({ where: dateFilter }),
        ]);
        return {
            totalUsers,
            activeUsers,
            newUsers,
            totalTransactions,
            totalBudgets,
        };
    }
    static async findAllPayments(filters, pagination) {
        const { userId, status, plan, from, to } = filters;
        const { page, limit, sortBy, sortOrder } = pagination;
        const whereClause = {
            ...(userId && { userId }),
            ...(status && { status }),
            ...(plan && { plan }),
            ...(from || to
                ? { createdAt: { ...(from && { gte: from }), ...(to && { lte: to }) } }
                : {}),
        };
        const skip = (page - 1) * limit;
        const [payments, total] = await Promise.all([
            prisma_1.default.payment.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: { id: true, email: true, fullName: true },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            prisma_1.default.payment.count({ where: whereClause }),
        ]);
        return {
            data: payments,
            meta: (0, repository_utils_1.createPaginationMeta)(total, page, limit),
        };
    }
    static async findPaymentById(id) {
        return prisma_1.default.payment.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, email: true, fullName: true },
                },
                subscription: true,
            },
        });
    }
    static async getPaymentStats(from, to) {
        const dateFilter = from || to
            ? { createdAt: { ...(from && { gte: from }), ...(to && { lte: to }) } }
            : {};
        const [totalPayments, completedPayments, pendingPayments, failedPayments, refundedPayments, totalRevenue,] = await Promise.all([
            prisma_1.default.payment.count({ where: dateFilter }),
            prisma_1.default.payment.count({
                where: { ...dateFilter, status: client_1.PaymentStatus.COMPLETED },
            }),
            prisma_1.default.payment.count({
                where: { ...dateFilter, status: client_1.PaymentStatus.PENDING },
            }),
            prisma_1.default.payment.count({
                where: { ...dateFilter, status: client_1.PaymentStatus.FAILED },
            }),
            prisma_1.default.payment.count({
                where: { ...dateFilter, status: client_1.PaymentStatus.REFUNDED },
            }),
            prisma_1.default.payment.aggregate({
                where: { ...dateFilter, status: client_1.PaymentStatus.COMPLETED },
                _sum: { amount: true },
            }),
        ]);
        return {
            totalPayments,
            completedPayments,
            pendingPayments,
            failedPayments,
            refundedPayments,
            totalRevenue: Number(totalRevenue._sum.amount ?? 0),
        };
    }
}
exports.AdminRepository = AdminRepository;
AdminRepository.findSystemCategoryBySlug = category_repository_1.CategoryRepository.findSystemCategoryBySlug;
AdminRepository.systemCategoryHasTransactions = category_repository_1.CategoryRepository.hasTransactions;
AdminRepository.systemCategoryHasBudgetAllocations = category_repository_1.CategoryRepository.hasBudgetAllocations;
