import prisma from "../../config/prisma";
import { TransactionType } from "../../generated/prisma/client";
import type {
  MonthlySummary,
  CategoryBreakdown,
  MonthlyTrend,
} from "./analytics.types";

export class AnalyticsRepository {
  /**
   * Get monthly summary for a user
   */
  static async getMonthlySummary(
    userId: string,
    month: number,
    year: number
  ): Promise<MonthlySummary> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const [incomeResult, expenseResult, countResult] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId,
          type: "INCOME",
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: "EXPENSE",
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.count({
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

  /**
   * Get yearly summary for a user (all 12 months)
   */
  static async getYearlySummary(
    userId: string,
    year: number
  ): Promise<{
    year: number;
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    transactionCount: number;
    monthlyBreakdown: MonthlySummary[];
  }> {
    // Get monthly breakdown by fetching summary for each month
    const monthlyPromises = Array.from({ length: 12 }, (_, i) =>
      this.getMonthlySummary(userId, i + 1, year)
    );

    const monthlyBreakdown = await Promise.all(monthlyPromises);

    // Calculate yearly totals from monthly data
    const totalIncome = monthlyBreakdown.reduce(
      (sum, m) => sum + m.totalIncome,
      0
    );
    const totalExpense = monthlyBreakdown.reduce(
      (sum, m) => sum + m.totalExpense,
      0
    );
    const transactionCount = monthlyBreakdown.reduce(
      (sum, m) => sum + m.transactionCount,
      0
    );

    return {
      year,
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      transactionCount,
      monthlyBreakdown,
    };
  }

  /**
   * Get category breakdown for a period
   */
  static async getCategoryBreakdown(
    userId: string,
    month: number,
    year: number,
    type?: TransactionType
  ): Promise<CategoryBreakdown[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const whereClause = {
      userId,
      date: { gte: startDate, lte: endDate },
      ...(type && { type }),
    };

    // Get total for percentage calculation
    const totalResult = await prisma.transaction.aggregate({
      where: whereClause,
      _sum: { amount: true },
    });
    const grandTotal = Number(totalResult._sum.amount ?? 0);

    if (grandTotal === 0) {
      return [];
    }

    // Get breakdown by category
    const categoryData = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: whereClause,
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: "desc" } },
    });

    // Get category details
    const categoryIds = categoryData
      .map((c) => c.categoryId)
      .filter((id): id is string => id !== null);

    const categories = await prisma.category.findMany({
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

  /**
   * Get spending trends over multiple months (PRO feature)
   */
  static async getTrends(
    userId: string,
    months: number
  ): Promise<MonthlyTrend[]> {
    const now = new Date();

    // Build array of month/year pairs to fetch
    const monthsToFetch = Array.from({ length: months }, (_, i) => {
      const targetDate = new Date(
        now.getFullYear(),
        now.getMonth() - (months - 1 - i),
        1
      );
      return {
        month: targetDate.getMonth() + 1,
        year: targetDate.getFullYear(),
      };
    });

    // Fetch all months in parallel for better performance
    const summaries = await Promise.all(
      monthsToFetch.map(({ month, year }) =>
        this.getMonthlySummary(userId, month, year)
      )
    );

    // Transform to MonthlyTrend format
    return summaries.map((summary) => ({
      month: summary.month,
      year: summary.year,
      income: summary.totalIncome,
      expense: summary.totalExpense,
      netBalance: summary.netBalance,
    }));
  }

  /**
   * Get budget vs actual comparison for a month (PRO feature)
   */
  static async getBudgetComparison(
    userId: string,
    month: number,
    year: number
  ): Promise<{
    budgetId: string | null;
    totalBudget: number | null;
    totalSpent: number;
    remaining: number | null;
    categories: {
      categoryId: string | null;
      categoryName: string;
      budgeted: number;
      spent: number;
      remaining: number;
      percentUsed: number;
    }[];
  }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Get budget for this month
    const budget = await prisma.budget.findUnique({
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

    // Get actual spending by category
    const spending = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        type: "EXPENSE",
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    // Create spending map with proper handling of null categoryId
    const spendingMap = new Map<string | null, number>(
      spending.map((s) => [s.categoryId, Number(s._sum.amount ?? 0)])
    );

    const totalSpent = Array.from(spendingMap.values()).reduce(
      (a, b) => a + b,
      0
    );

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

    // Track which categories are in the budget
    const budgetedCategoryIds = new Set(
      budget.allocations.map((a) => a.categoryId)
    );

    // Build categories array from budget allocations
    const categories: {
      categoryId: string | null;
      categoryName: string;
      budgeted: number;
      spent: number;
      remaining: number;
      percentUsed: number;
    }[] = budget.allocations.map((alloc) => {
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

    // Add unbudgeted spending (categories with spending but not in budget)
    let unbudgetedSpent = 0;
    for (const [categoryId, amount] of spendingMap) {
      if (categoryId !== null && !budgetedCategoryIds.has(categoryId)) {
        unbudgetedSpent += amount;
      }
    }

    if (unbudgetedSpent > 0) {
      categories.push({
        categoryId: null,
        categoryName: "Other (Unbudgeted)",
        budgeted: 0,
        spent: unbudgetedSpent,
        remaining: -unbudgetedSpent,
        percentUsed: 0,
      });
    }

    // Add uncategorized spending (transactions without a category)
    const uncategorizedSpent = spendingMap.get(null) ?? 0;
    if (uncategorizedSpent > 0) {
      categories.push({
        categoryId: null,
        categoryName: "Uncategorized",
        budgeted: 0,
        spent: uncategorizedSpent,
        remaining: -uncategorizedSpent,
        percentUsed: 0,
      });
    }

    return {
      budgetId: budget.id,
      totalBudget,
      totalSpent,
      remaining: totalBudget !== null ? totalBudget - totalSpent : null,
      categories,
    };
  }
}
