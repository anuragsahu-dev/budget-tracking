import { z } from "zod";

const monthSchema = z.coerce
  .number()
  .int()
  .min(1, "Month must be between 1 and 12")
  .max(12, "Month must be between 1 and 12");

const yearSchema = z.coerce
  .number()
  .int()
  .min(2000, "Year must be 2000 or later")
  .max(2100, "Year must be 2100 or earlier");

// ========== MONTHLY SUMMARY (FREE + PRO) ==========
// FREE: Current month only
// PRO: Any month/year
export const monthlySummaryQuerySchema = z.object({
  month: monthSchema.optional(), // PRO only - defaults to current month for FREE
  year: yearSchema.optional(), // PRO only - defaults to current year for FREE
});

export type MonthlySummaryQuery = z.infer<typeof monthlySummaryQuerySchema>;

// ========== YEARLY SUMMARY (PRO ONLY) ==========
export const yearlySummaryQuerySchema = z.object({
  year: yearSchema.optional(), // Defaults to current year
});

export type YearlySummaryQuery = z.infer<typeof yearlySummaryQuerySchema>;

// ========== CATEGORY SUMMARY (FREE + PRO) ==========
// FREE: Current month only
// PRO: Any date range
export const categorySummaryQuerySchema = z.object({
  month: monthSchema.optional(),
  year: yearSchema.optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(), // Filter by transaction type
});

export type CategorySummaryQuery = z.infer<typeof categorySummaryQuerySchema>;

// ========== TRENDS (PRO ONLY) ==========
export const trendsQuerySchema = z.object({
  months: z.coerce
    .number()
    .int()
    .min(3, "Minimum 3 months for trends")
    .max(12, "Maximum 12 months for trends")
    .default(6),
});

export type TrendsQuery = z.infer<typeof trendsQuerySchema>;
