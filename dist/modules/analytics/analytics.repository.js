"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class AnalyticsRepository {
    static async getMonthlySummary(userId, month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        const [incomeResult, expenseResult, countResult] = await Promise.all([
            prisma_1.default.transaction.aggregate({
                where: {
                    userId,
                    type: "INCOME",
                    date: { gte: startDate, lte: endDate },
                },
                _sum: { amount: true },
            }),
            prisma_1.default.transaction.aggregate({
                where: {
                    userId,
                    type: "EXPENSE",
                    date: { gte: startDate, lte: endDate },
                },
                _sum: { amount: true },
            }),
            prisma_1.default.transaction.count({
                where: {
                    userId,
                    date: { gte: startDate, lte: endDate },
                },
            }),
        ]);
        const totalIncome = Number(incomeResult._sum.amount ?? 0);
        const totalExpense = Number(expenseResult._sum.amount ?? 0);
        return {
            month,
            year,
            totalIncome,
            totalExpense,
            netBalance: totalIncome - totalExpense,
            transactionCount: countResult,
        };
    }
    static async getYearlySummary(userId, year) {
        const monthlyPromises = Array.from({ length: 12 }, (_, i) => this.getMonthlySummary(userId, i + 1, year));
        const monthlyBreakdown = await Promise.all(monthlyPromises);
        const totalIncome = monthlyBreakdown.reduce((sum, m) => sum + m.totalIncome, 0);
        const totalExpense = monthlyBreakdown.reduce((sum, m) => sum + m.totalExpense, 0);
        const transactionCount = monthlyBreakdown.reduce((sum, m) => sum + m.transactionCount, 0);
        return {
            year,
            totalIncome,
            totalExpense,
            netBalance: totalIncome - totalExpense,
            transactionCount,
            monthlyBreakdown,
        };
    }
    static async getCategoryBreakdown(userId, month, year, type) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        const whereClause = {
            userId,
            date: { gte: startDate, lte: endDate },
            ...(type && { type }),
        };
        const totalResult = await prisma_1.default.transaction.aggregate({
            where: whereClause,
            _sum: { amount: true },
        });
        const grandTotal = Number(totalResult._sum.amount ?? 0);
        if (grandTotal === 0) {
            return [];
        }
        const categoryData = await prisma_1.default.transaction.groupBy({
            by: ["categoryId"],
            where: whereClause,
            _sum: { amount: true },
            _count: true,
            orderBy: { _sum: { amount: "desc" } },
        });
        const categoryIds = categoryData
            .map((c) => c.categoryId)
            .filter((id) => id !== null);
        const categories = await prisma_1.default.category.findMany({
            where: { id: { in: categoryIds } },
            select: { id: true, name: true, color: true },
        });
        const categoryMap = new Map(categories.map((c) => [c.id, c]));
        return categoryData.map((item) => {
            const category = item.categoryId
                ? categoryMap.get(item.categoryId)
                : null;
            const total = Number(item._sum.amount ?? 0);
            return {
                categoryId: item.categoryId,
                categoryName: category?.name ?? "Uncategorized",
                categoryColor: category?.color ?? null,
                total,
                percentage: Math.round((total / grandTotal) * 100 * 100) / 100,
                transactionCount: item._count,
            };
        });
    }
    static async getTrends(userId, months) {
        const now = new Date();
        const trends = [];
        for (let i = months - 1; i >= 0; i--) {
            const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = targetDate.getMonth() + 1;
            const year = targetDate.getFullYear();
            const summary = await this.getMonthlySummary(userId, month, year);
            trends.push({
                month,
                year,
                income: summary.totalIncome,
                expense: summary.totalExpense,
                netBalance: summary.netBalance,
            });
        }
        return trends;
    }
    static async getBudgetComparison(userId, month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        const budget = await prisma_1.default.budget.findUnique({
            where: {
                userId_month_year: { userId, month, year },
            },
            include: {
                allocations: {
                    include: {
                        category: {
                            select: { id: true, name: true },
                        },
                    },
                },
            },
        });
        const spending = await prisma_1.default.transaction.groupBy({
            by: ["categoryId"],
            where: {
                userId,
                type: "EXPENSE",
                date: { gte: startDate, lte: endDate },
            },
            _sum: { amount: true },
        });
        const spendingMap = new Map(spending.map((s) => [s.categoryId, Number(s._sum.amount ?? 0)]));
        const totalSpent = Array.from(spendingMap.values()).reduce((a, b) => a + b, 0);
        if (!budget) {
            return {
                budgetId: null,
                totalBudget: null,
                totalSpent,
                remaining: null,
                categories: [],
            };
        }
        const totalBudget = budget.totalLimit ? Number(budget.totalLimit) : null;
        const categories = budget.allocations.map((alloc) => {
            const budgeted = Number(alloc.amount);
            const spent = spendingMap.get(alloc.categoryId) ?? 0;
            const remaining = budgeted - spent;
            return {
                categoryId: alloc.categoryId,
                categoryName: alloc.category.name,
                budgeted,
                spent,
                remaining,
                percentUsed: budgeted > 0 ? Math.round((spent / budgeted) * 100) : 0,
            };
        });
        return {
            budgetId: budget.id,
            totalBudget,
            totalSpent,
            remaining: totalBudget !== null ? totalBudget - totalSpent : null,
            categories,
        };
    }
}
exports.AnalyticsRepository = AnalyticsRepository;
