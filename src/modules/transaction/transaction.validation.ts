import { z } from "zod";
import { ulidSchema } from "../../validations/common.schema";

const transactionTypeSchema = z.enum(["INCOME", "EXPENSE"]);

const amountSchema = z
  .number()
  .positive("Amount must be a positive number")
  .max(9999999999.99, "Amount exceeds maximum allowed value");

const descriptionSchema = z
  .string()
  .trim()
  .max(500, "Description must not exceed 500 characters")
  .optional()
  .nullable();
const dateSchema = z.coerce.date();

export const createTransactionSchema = z.object({
  amount: amountSchema,
  type: transactionTypeSchema,
  categoryId: ulidSchema.optional().nullable(),
  description: descriptionSchema,
  date: dateSchema.optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = z.object({
  amount: amountSchema.optional(),
  type: transactionTypeSchema.optional(),
  categoryId: ulidSchema.optional().nullable(),
  description: descriptionSchema,
  date: dateSchema.optional(),
});

export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

export const transactionIdParamSchema = z.object({
  id: ulidSchema,
});

export type TransactionIdParam = z.infer<typeof transactionIdParamSchema>;

export const listTransactionsQuerySchema = z.object({
  type: transactionTypeSchema.optional(),
  categoryId: ulidSchema.optional(),

  from: dateSchema.optional(),
  to: dateSchema.optional(),

  page: z.coerce
    .number()
    .int()
    .positive("Page must be a positive integer")
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .positive("Limit must be a positive integer")
    .max(100, "Limit cannot exceed 100")
    .default(20),

  sortBy: z.enum(["date", "amount", "createdAt"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;

export const transactionSummaryQuerySchema = z.object({
  from: dateSchema.optional(),
  to: dateSchema.optional(),
});

export type TransactionSummaryQuery = z.infer<
  typeof transactionSummaryQuerySchema
>;
