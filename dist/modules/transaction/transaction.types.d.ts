import type { Transaction, TransactionType } from "../../generated/prisma/client";
import type { CategorySelect } from "../../types/common.types";
export type { CategorySelect };
export type TransactionWithCategory = Transaction & {
    category: CategorySelect | null;
};
export interface TransactionFilters {
    userId: string;
    type?: TransactionType;
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
