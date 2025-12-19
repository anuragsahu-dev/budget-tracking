import { z } from "zod";
export declare const createBudgetSchema: z.ZodObject<{
    month: z.ZodCoercedNumber<unknown>;
    year: z.ZodCoercedNumber<unknown>;
    totalLimit: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    note: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export declare const updateBudgetSchema: z.ZodObject<{
    totalLimit: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    note: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export declare const budgetIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type BudgetIdParam = z.infer<typeof budgetIdParamSchema>;
export declare const listBudgetsQuerySchema: z.ZodObject<{
    month: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    year: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type ListBudgetsQuery = z.infer<typeof listBudgetsQuerySchema>;
export declare const budgetAllocationParamsSchema: z.ZodObject<{
    budgetId: z.ZodString;
}, z.core.$strip>;
export type BudgetAllocationParams = z.infer<typeof budgetAllocationParamsSchema>;
export declare const allocationIdParamSchema: z.ZodObject<{
    budgetId: z.ZodString;
    id: z.ZodString;
}, z.core.$strip>;
export type AllocationIdParam = z.infer<typeof allocationIdParamSchema>;
export declare const createAllocationSchema: z.ZodObject<{
    categoryId: z.ZodString;
    amount: z.ZodNumber;
}, z.core.$strip>;
export type CreateAllocationInput = z.infer<typeof createAllocationSchema>;
export declare const updateAllocationSchema: z.ZodObject<{
    amount: z.ZodNumber;
}, z.core.$strip>;
export type UpdateAllocationInput = z.infer<typeof updateAllocationSchema>;
