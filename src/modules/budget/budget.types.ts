import type { Budget, BudgetAllocation } from "../../generated/prisma/client";
import type { CategorySelect } from "../../types/common.types";

// Re-export for convenience
export type { CategorySelect };

export type AllocationWithCategory = BudgetAllocation & {
  category: CategorySelect;
};

export type BudgetWithAllocations = Budget & {
  allocations: AllocationWithCategory[];
};

export interface BudgetFilters {
  userId: string;
  month?: number;
  year?: number;
}

export interface BudgetPaginationOptions {
  page: number;
  limit: number;
}
