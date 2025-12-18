import type { CreateTransactionInput, UpdateTransactionInput, ListTransactionsQuery } from "./transaction.validation";
import { TransactionType } from "../../generated/prisma/client";
export declare class TransactionService {
    static getAllTransactions(userId: string, query: ListTransactionsQuery): Promise<{
        transactions: {
            id: string;
            amount: number;
            type: TransactionType;
            description: string | null;
            date: Date;
            category: import("./transaction.types").CategorySelect | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: import("../../utils").PaginationMeta;
    }>;
    static getTransactionById(transactionId: string, userId: string): Promise<{
        id: string;
        amount: number;
        type: TransactionType;
        description: string | null;
        date: Date;
        category: import("./transaction.types").CategorySelect | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static createTransaction(userId: string, data: CreateTransactionInput): Promise<{
        id: string;
        amount: number;
        type: TransactionType;
        description: string | null;
        date: Date;
        category: import("./transaction.types").CategorySelect | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static updateTransaction(transactionId: string, userId: string, data: UpdateTransactionInput): Promise<{
        id: string;
        amount: number;
        type: TransactionType;
        description: string | null;
        date: Date;
        category: import("./transaction.types").CategorySelect | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static deleteTransaction(transactionId: string, userId: string): Promise<{
        message: string;
    }>;
    static getTransactionSummary(userId: string, from?: Date, to?: Date): Promise<{
        totalIncome: number;
        totalExpense: number;
        netBalance: number;
    }>;
}
