import prisma from "../../config/prisma";
import { TransactionType } from "../../generated/prisma/client";

// Monthly summary result
export interface MonthlySummary {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
}

// Category breakdown item
export interface CategoryBreakdown {
  categoryId: string | null;
  categoryName: string;
  categoryColor: string | null;
  total: number;
  percentage: number;
  transactionCount: number;
}

// Monthly trend item
export interface MonthlyTrend {
  month: number;
  year: number;
  income: number;
  expense: number;
  netBalance: number;
}

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
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

    // Get yearly totals
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

    // Get monthly breakdown using raw SQL for efficiency
    const monthlyData = await prisma.$queryRaw<
      { month: number; type: string; total: number; count: bigint }[]
    >`
      SELECT 
        EXTRACT(MONTH FROM date)::int as month,
        type,
        COALESCE(SUM(amount), 0) as total,
        COUNT(*) as count
      FROM "Transaction"
      WHERE "userId" = ${userId}
        AND date >= ${startDate}
        AND date <= ${endDate}
      GROUP BY EXTRACT(MONTH FROM date), type
      ORDER BY month
    `;

    // Process monthly breakdown
    const monthlyMap = new Map<
      number,
      { income: number; expense: number; count: number }
    >();

    for (let m = 1; m <= 12; m++) {
      monthlyMap.set(m, { income: 0, expense: 0, count: 0 });
    }

    for (const row of monthlyData) {
      const existing = monthlyMap.get(row.month)!;
      if (row.type === "INCOME") {
        existing.income = Number(row.total);
      } else {
        existing.expense = Number(row.total);
      }
      existing.count += Number(row.count);
    }

    const monthlyBreakdown: MonthlySummary[] = Array.from(
      monthlyMap.entries()
    ).map(([month, data]) => ({
      month,
      year,
      totalIncome: data.income,
      totalExpense: data.expense,
      netBalance: data.income - data.expense,
      transactionCount: data.count,
    }));

    const totalIncome = Number(incomeResult._sum.amount ?? 0);
    const totalExpense = Number(expenseResult._sum.amount ?? 0);

    return {
      year,
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      transactionCount: countResult,
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
    const trends: MonthlyTrend[] = [];

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
      categoryId: string;
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

    const spendingMap = new Map(
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
