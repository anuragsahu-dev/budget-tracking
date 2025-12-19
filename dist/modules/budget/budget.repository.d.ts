import { Prisma, Budget, BudgetAllocation } from "../../generated/prisma/client";
import { RepositoryResult, PaginatedResult } from "../../utils/repository.utils";
import type { BudgetWithAllocations, BudgetFilters, BudgetPaginationOptions, AllocationWithCategory } from "./budget.types";
export type { BudgetWithAllocations, BudgetFilters, BudgetPaginationOptions, AllocationWithCategory, };
export declare class BudgetRepository {
    static findAllByUser(filters: BudgetFilters, pagination: BudgetPaginationOptions): Promise<PaginatedResult<BudgetWithAllocations>>;
    static findById(id: string): Promise<BudgetWithAllocations | null>;
    static findByUserMonthYear(userId: string, month: number, year: number): Promise<Budget | null>;
    static create(data: Prisma.BudgetCreateInput): Promise<RepositoryResult<BudgetWithAllocations>>;
    static update(id: string, data: Prisma.BudgetUpdateInput): Promise<RepositoryResult<BudgetWithAllocations>>;
    static delete(id: string): Promise<RepositoryResult<Budget>>;
    static findAllocationById(id: string): Promise<AllocationWithCategory | null>;
    static findAllocationByBudgetAndCategory(budgetId: string, categoryId: string): Promise<BudgetAllocation | null>;
    static createAllocation(data: Prisma.BudgetAllocationCreateInput): Promise<RepositoryResult<AllocationWithCategory>>;
    static updateAllocation(id: string, data: Prisma.BudgetAllocationUpdateInput): Promise<RepositoryResult<AllocationWithCategory>>;
    static deleteAllocation(id: string): Promise<RepositoryResult<BudgetAllocation>>;
}
