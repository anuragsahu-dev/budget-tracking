import { z } from "zod";
import { ulidSchema } from "../../validations/common.schema";

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

const amountSchema = z
  .number()
  .positive("Amount must be a positive number")
  .max(9999999999.99, "Amount exceeds maximum allowed value");

const noteSchema = z
  .string()
  .trim()
  .max(500, "Note must not exceed 500 characters")
  .optional()
  .nullable();

// ========== BUDGET SCHEMAS ==========

export const createBudgetSchema = z.object({
  month: monthSchema,
  year: yearSchema,
  totalLimit: amountSchema.optional().nullable(),
  note: noteSchema,
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;

export const updateBudgetSchema = z.object({
  totalLimit: amountSchema.optional().nullable(),
  note: noteSchema,
});

export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;

export const budgetIdParamSchema = z.object({
  id: ulidSchema,
});

export type BudgetIdParam = z.infer<typeof budgetIdParamSchema>;

export const listBudgetsQuerySchema = z.object({
  month: monthSchema.optional(),
  year: yearSchema.optional(),
  page: z.coerce
    .number()
    .int()
    .positive("Page must be a positive integer")
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .positive("Limit must be a positive integer")
    .max(50, "Limit cannot exceed 50")
    .default(12),
});

export type ListBudgetsQuery = z.infer<typeof listBudgetsQuerySchema>;

// ========== BUDGET ALLOCATION SCHEMAS ==========

export const budgetAllocationParamsSchema = z.object({
  budgetId: ulidSchema,
});

export type BudgetAllocationParams = z.infer<
  typeof budgetAllocationParamsSchema
>;

export const allocationIdParamSchema = z.object({
  budgetId: ulidSchema,
  id: ulidSchema,
});

export type AllocationIdParam = z.infer<typeof allocationIdParamSchema>;

export const createAllocationSchema = z.object({
  categoryId: ulidSchema,
  amount: amountSchema,
});

export type CreateAllocationInput = z.infer<typeof createAllocationSchema>;

export const updateAllocationSchema = z.object({
  amount: amountSchema,
});

export type UpdateAllocationInput = z.infer<typeof updateAllocationSchema>;
