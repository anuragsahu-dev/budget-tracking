import { Transaction } from "../../generated/prisma/client";

export type CategorySelect = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
};

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
