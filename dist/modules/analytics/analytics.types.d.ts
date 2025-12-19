export interface MonthlySummary {
    month: number;
    year: number;
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    transactionCount: number;
}
export interface CategoryBreakdown {
    categoryId: string | null;
    categoryName: string;
    categoryColor: string | null;
    total: number;
    percentage: number;
    transactionCount: number;
}
export interface MonthlyTrend {
    month: number;
    year: number;
    income: number;
    expense: number;
    netBalance: number;
}
