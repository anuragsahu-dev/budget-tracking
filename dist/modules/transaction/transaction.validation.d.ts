import { z } from "zod";
export declare const createTransactionSchema: z.ZodObject<{
    amount: z.ZodNumber;
    type: z.ZodEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>;
    categoryId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export declare const updateTransactionSchema: z.ZodObject<{
    amount: z.ZodOptional<z.ZodNumber>;
    type: z.ZodOptional<z.ZodEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>>;
    categoryId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export declare const transactionIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type TransactionIdParam = z.infer<typeof transactionIdParamSchema>;
export declare const listTransactionsQuerySchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>>;
    categoryId: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    to: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        amount: "amount";
        date: "date";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;
export declare const transactionSummaryQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    to: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type TransactionSummaryQuery = z.infer<typeof transactionSummaryQuerySchema>;
