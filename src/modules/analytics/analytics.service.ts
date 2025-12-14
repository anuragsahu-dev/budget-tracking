import { AnalyticsRepository } from "./analytics.repository";
import { ApiError } from "../../middlewares/error.middleware";
import type {
  MonthlySummaryQuery,
  YearlySummaryQuery,
  CategorySummaryQuery,
  TrendsQuery,
} from "./analytics.validation";
import prisma from "../../config/prisma";

async function hasActiveSubscription(userId: string): Promise<boolean> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { status: true, expiresAt: true },
  });
  return sub?.status === "ACTIVE" && sub.expiresAt > new Date();
}

function getCurrentPeriod() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

function requirePro(isPro: boolean, feature: string) {
  if (!isPro)
    throw new ApiError(403, `${feature} is a PRO feature. Please upgrade.`);
}

export class AnalyticsService {
  static async getMonthlySummary(userId: string, query: MonthlySummaryQuery) {
    const isPro = await hasActiveSubscription(userId);
    const current = getCurrentPeriod();

    // FREE users can only see current month
    const month = isPro ? query.month ?? current.month : current.month;
    const year = isPro ? query.year ?? current.year : current.year;

    const summary = await AnalyticsRepository.getMonthlySummary(
      userId,
      month,
      year
    );

    return {
      ...summary,
      isPro,
      ...(!isPro && { hint: "Upgrade to PRO to view any month's analytics" }),
    };
  }

  static async getYearlySummary(userId: string, query: YearlySummaryQuery) {
    const isPro = await hasActiveSubscription(userId);
    requirePro(isPro, "Yearly summary");

    const year = query.year ?? getCurrentPeriod().year;
    const summary = await AnalyticsRepository.getYearlySummary(userId, year);

    return { ...summary, isPro: true };
  }

  static async getCategorySummary(userId: string, query: CategorySummaryQuery) {
    const isPro = await hasActiveSubscription(userId);
    const current = getCurrentPeriod();

    const month = isPro ? query.month ?? current.month : current.month;
    const year = isPro ? query.year ?? current.year : current.year;

    const categories = await AnalyticsRepository.getCategoryBreakdown(
      userId,
      month,
      year,
      query.type
    );
    const limitedCategories = isPro ? categories : categories.slice(0, 5);

    return {
      month,
      year,
      type: query.type ?? "ALL",
      categories: limitedCategories,
      totalCategories: categories.length,
      isPro,
      ...(!isPro &&
        categories.length > 5 && {
          hint: `Showing top 5 of ${categories.length}. Upgrade to PRO to see all.`,
        }),
    };
  }

  static async getTrends(userId: string, query: TrendsQuery) {
    const isPro = await hasActiveSubscription(userId);
    requirePro(isPro, "Spending trends");

    const trends = await AnalyticsRepository.getTrends(userId, query.months);
    const avgIncome = trends.reduce((s, t) => s + t.income, 0) / trends.length;
    const avgExpense =
      trends.reduce((s, t) => s + t.expense, 0) / trends.length;
    const sorted = [...trends].sort((a, b) => b.netBalance - a.netBalance);

    return {
      months: query.months,
      trends,
      insights: {
        averageMonthlyIncome: Math.round(avgIncome * 100) / 100,
        averageMonthlyExpense: Math.round(avgExpense * 100) / 100,
        averageMonthlySavings: Math.round((avgIncome - avgExpense) * 100) / 100,
        bestMonth: sorted[0] || null,
        worstMonth: sorted[sorted.length - 1] || null,
      },
      isPro: true,
    };
  }

  static async getBudgetComparison(
    userId: string,
    month?: number,
    year?: number
  ) {
    const isPro = await hasActiveSubscription(userId);
    requirePro(isPro, "Budget comparison");

    const current = getCurrentPeriod();
    const comparison = await AnalyticsRepository.getBudgetComparison(
      userId,
      month ?? current.month,
      year ?? current.year
    );

    return {
      month: month ?? current.month,
      year: year ?? current.year,
      ...comparison,
      isPro: true,
    };
  }

  static async getDashboardOverview(userId: string) {
    const isPro = await hasActiveSubscription(userId);
    const current = getCurrentPeriod();

    const [monthlySummary, categories] = await Promise.all([
      AnalyticsRepository.getMonthlySummary(
        userId,
        current.month,
        current.year
      ),
      AnalyticsRepository.getCategoryBreakdown(
        userId,
        current.month,
        current.year,
        "EXPENSE"
      ),
    ]);

    const topCategories = isPro
      ? categories.slice(0, 10)
      : categories.slice(0, 3);

    let recentTrend = null;
    let budgetStatus = null;

    if (isPro) {
      [recentTrend, budgetStatus] = await Promise.all([
        AnalyticsRepository.getTrends(userId, 3),
        AnalyticsRepository.getBudgetComparison(
          userId,
          current.month,
          current.year
        ),
      ]);
    }

    return {
      period: current,
      summary: {
        totalIncome: monthlySummary.totalIncome,
        totalExpense: monthlySummary.totalExpense,
        netBalance: monthlySummary.netBalance,
        transactionCount: monthlySummary.transactionCount,
      },
      topExpenseCategories: topCategories,
      ...(isPro
        ? {
            recentTrend,
            budgetStatus: budgetStatus?.budgetId
              ? {
                  budgetId: budgetStatus.budgetId,
                  totalBudget: budgetStatus.totalBudget,
                  totalSpent: budgetStatus.totalSpent,
                  remaining: budgetStatus.remaining,
                  percentUsed: budgetStatus.totalBudget
                    ? Math.round(
                        (budgetStatus.totalSpent / budgetStatus.totalBudget) *
                          100
                      )
                    : null,
                }
              : null,
          }
        : { hint: "Upgrade to PRO for trends and budget tracking" }),
      isPro,
    };
  }
}
