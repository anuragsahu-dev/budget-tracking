import { z } from "zod";
export declare const monthlySummaryQuerySchema: z.ZodObject<{
    month: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    year: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type MonthlySummaryQuery = z.infer<typeof monthlySummaryQuerySchema>;
export declare const yearlySummaryQuerySchema: z.ZodObject<{
    year: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type YearlySummaryQuery = z.infer<typeof yearlySummaryQuerySchema>;
export declare const categorySummaryQuerySchema: z.ZodObject<{
    month: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    year: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    type: z.ZodOptional<z.ZodEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>>;
}, z.core.$strip>;
export type CategorySummaryQuery = z.infer<typeof categorySummaryQuerySchema>;
export declare const trendsQuerySchema: z.ZodObject<{
    months: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type TrendsQuery = z.infer<typeof trendsQuerySchema>;
