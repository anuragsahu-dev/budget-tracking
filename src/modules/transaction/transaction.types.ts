import type { Transaction } from "../../generated/prisma/client";
import type { CategorySelect } from "../../types/common.types";

// Re-export for convenience
export type { CategorySelect };

export type TransactionWithCategory = Transaction & {
  category: CategorySelect | null;
};

export interface TransactionFilters {
  userId: string;
  type?: "INCOME" | "EXPENSE";
  categoryId?: string;
  from?: Date;
  to?: Date;
}

export interface TransactionPaginationOptions {
  page: number;
  limit: number;
  sortBy: "date" | "amount" | "createdAt";
  sortOrder: "asc" | "desc";
}
