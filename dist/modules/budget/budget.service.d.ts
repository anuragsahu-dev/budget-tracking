import type { CreateBudgetInput, UpdateBudgetInput, ListBudgetsQuery, CreateAllocationInput, UpdateAllocationInput } from "./budget.validation";
export declare class BudgetService {
    static getAllBudgets(userId: string, query: ListBudgetsQuery): Promise<{
        budgets: {
            id: string;
            month: number;
            year: number;
            totalLimit: number | null;
            note: string | null;
            allocations: {
                id: string;
                amount: number;
                category: import("./budget.types").CategorySelect;
            }[];
            allocatedTotal: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: import("../../utils").PaginationMeta;
    }>;
    static getBudgetById(budgetId: string, userId: string): Promise<{
        id: string;
        month: number;
        year: number;
        totalLimit: number | null;
        note: string | null;
        allocations: {
            id: string;
            amount: number;
            category: import("./budget.types").CategorySelect;
        }[];
        allocatedTotal: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static createBudget(userId: string, data: CreateBudgetInput): Promise<{
        id: string;
        month: number;
        year: number;
        totalLimit: number | null;
        note: string | null;
        allocations: {
            id: string;
            amount: number;
            category: import("./budget.types").CategorySelect;
        }[];
        allocatedTotal: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static updateBudget(budgetId: string, userId: string, data: UpdateBudgetInput): Promise<{
        id: string;
        month: number;
        year: number;
        totalLimit: number | null;
        note: string | null;
        allocations: {
            id: string;
            amount: number;
            category: import("./budget.types").CategorySelect;
        }[];
        allocatedTotal: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static deleteBudget(budgetId: string, userId: string): Promise<{
        message: string;
    }>;
    static createAllocation(budgetId: string, userId: string, data: CreateAllocationInput): Promise<{
        id: string;
        budgetId: string;
        amount: number;
        category: import("./budget.types").CategorySelect;
    }>;
    static updateAllocation(budgetId: string, allocationId: string, userId: string, data: UpdateAllocationInput): Promise<{
        id: string;
        budgetId: string;
        amount: number;
        category: import("./budget.types").CategorySelect;
    }>;
    static deleteAllocation(budgetId: string, allocationId: string, userId: string): Promise<{
        message: string;
    }>;
}
