import { Budget, BudgetAllocation } from "../../generated/prisma/client";

export type CategorySelect = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
};

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
