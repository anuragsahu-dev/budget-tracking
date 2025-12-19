import type { MonthlySummaryQuery, YearlySummaryQuery, CategorySummaryQuery, TrendsQuery } from "./analytics.validation";
export declare class AnalyticsService {
    static getMonthlySummary(userId: string, query: MonthlySummaryQuery): Promise<{
        hint?: string | undefined;
        isPro: boolean;
        month: number;
        year: number;
        totalIncome: number;
        totalExpense: number;
        netBalance: number;
        transactionCount: number;
    }>;
    static getYearlySummary(userId: string, query: YearlySummaryQuery): Promise<{
        isPro: boolean;
        year: number;
        totalIncome: number;
        totalExpense: number;
        netBalance: number;
        transactionCount: number;
        monthlyBreakdown: import("./analytics.types").MonthlySummary[];
    }>;
    static getCategorySummary(userId: string, query: CategorySummaryQuery): Promise<{
        hint?: string | undefined;
        month: number;
        year: number;
        type: string;
        categories: import("./analytics.types").CategoryBreakdown[];
        totalCategories: number;
        isPro: boolean;
    }>;
    static getTrends(userId: string, query: TrendsQuery): Promise<{
        months: number;
        trends: import("./analytics.types").MonthlyTrend[];
        insights: {
            averageMonthlyIncome: number;
            averageMonthlyExpense: number;
            averageMonthlySavings: number;
            bestMonth: import("./analytics.types").MonthlyTrend;
            worstMonth: import("./analytics.types").MonthlyTrend;
        };
        isPro: boolean;
    }>;
    static getBudgetComparison(userId: string, month?: number, year?: number): Promise<{
        isPro: boolean;
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
        month: number;
        year: number;
    }>;
    static getDashboardOverview(userId: string): Promise<{
        isPro: boolean;
        recentTrend: import("./analytics.types").MonthlyTrend[] | null;
        budgetStatus: {
            budgetId: string;
            totalBudget: number | null;
            totalSpent: number;
            remaining: number | null;
            percentUsed: number | null;
        } | null;
        period: {
            month: number;
            year: number;
        };
        summary: {
            totalIncome: number;
            totalExpense: number;
            netBalance: number;
            transactionCount: number;
        };
        topExpenseCategories: import("./analytics.types").CategoryBreakdown[];
    } | {
        isPro: boolean;
        hint: string;
        period: {
            month: number;
            year: number;
        };
        summary: {
            totalIncome: number;
            totalExpense: number;
            netBalance: number;
            transactionCount: number;
        };
        topExpenseCategories: import("./analytics.types").CategoryBreakdown[];
    }>;
}
