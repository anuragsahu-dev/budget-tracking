import { TransactionType } from "../../generated/prisma/client";
import type { MonthlySummary, CategoryBreakdown, MonthlyTrend } from "./analytics.types";
export type { MonthlySummary, CategoryBreakdown, MonthlyTrend };
export declare class AnalyticsRepository {
    static getMonthlySummary(userId: string, month: number, year: number): Promise<MonthlySummary>;
    static getYearlySummary(userId: string, year: number): Promise<{
        year: number;
        totalIncome: number;
        totalExpense: number;
        netBalance: number;
        transactionCount: number;
        monthlyBreakdown: MonthlySummary[];
    }>;
    static getCategoryBreakdown(userId: string, month: number, year: number, type?: TransactionType): Promise<CategoryBreakdown[]>;
    static getTrends(userId: string, months: number): Promise<MonthlyTrend[]>;
    static getBudgetComparison(userId: string, month: number, year: number): Promise<{
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
    }>;
}
