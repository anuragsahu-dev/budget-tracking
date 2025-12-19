import { Prisma, Transaction } from "../../generated/prisma/client";
import { RepositoryResult, PaginatedResult } from "../../utils/repository.utils";
import type { TransactionWithCategory, TransactionFilters, TransactionPaginationOptions } from "./transaction.types";
export type { TransactionWithCategory, TransactionFilters, TransactionPaginationOptions, };
export declare class TransactionRepository {
    static findAllByUser(filters: TransactionFilters, pagination: TransactionPaginationOptions): Promise<PaginatedResult<TransactionWithCategory>>;
    static findById(id: string): Promise<TransactionWithCategory | null>;
    static findByIdAndUser(id: string, userId: string): Promise<TransactionWithCategory | null>;
    static create(data: Prisma.TransactionCreateInput): Promise<RepositoryResult<TransactionWithCategory>>;
    static update(id: string, data: Prisma.TransactionUpdateInput): Promise<RepositoryResult<TransactionWithCategory>>;
    static delete(id: string): Promise<RepositoryResult<Transaction>>;
    static getSummaryByUser(userId: string, from?: Date, to?: Date): Promise<{
        totalIncome: number;
        totalExpense: number;
        netBalance: number;
    }>;
}
