"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionSummaryQuerySchema = exports.listTransactionsQuerySchema = exports.transactionIdParamSchema = exports.updateTransactionSchema = exports.createTransactionSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("../../validations/common.schema");
const client_1 = require("../../generated/prisma/client");
const transactionTypeValues = Object.values(client_1.TransactionType);
const transactionTypeSchema = zod_1.z.enum(transactionTypeValues);
const amountSchema = zod_1.z
    .number()
    .positive("Amount must be a positive number")
    .max(9999999999.99, "Amount exceeds maximum allowed value");
const descriptionSchema = zod_1.z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .nullable();
const dateSchema = zod_1.z.coerce.date();
exports.createTransactionSchema = zod_1.z.object({
    amount: amountSchema,
    type: transactionTypeSchema,
    categoryId: common_schema_1.ulidSchema.optional().nullable(),
    description: descriptionSchema,
    date: dateSchema.optional(),
});
exports.updateTransactionSchema = zod_1.z.object({
    amount: amountSchema.optional(),
    type: transactionTypeSchema.optional(),
    categoryId: common_schema_1.ulidSchema.optional().nullable(),
    description: descriptionSchema,
    date: dateSchema.optional(),
});
exports.transactionIdParamSchema = zod_1.z.object({
    id: common_schema_1.ulidSchema,
});
exports.listTransactionsQuerySchema = zod_1.z.object({
    type: transactionTypeSchema.optional(),
    categoryId: common_schema_1.ulidSchema.optional(),
    from: dateSchema.optional(),
    to: dateSchema.optional(),
    page: zod_1.z.coerce
        .number()
        .int()
        .positive("Page must be a positive integer")
        .default(1),
    limit: zod_1.z.coerce
        .number()
        .int()
        .positive("Limit must be a positive integer")
        .max(100, "Limit cannot exceed 100")
        .default(20),
    sortBy: zod_1.z.enum(["date", "amount", "createdAt"]).default("date"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
exports.transactionSummaryQuerySchema = zod_1.z.object({
    from: dateSchema.optional(),
    to: dateSchema.optional(),
});
