"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllocationSchema = exports.createAllocationSchema = exports.allocationIdParamSchema = exports.budgetAllocationParamsSchema = exports.listBudgetsQuerySchema = exports.budgetIdParamSchema = exports.updateBudgetSchema = exports.createBudgetSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("../../validations/common.schema");
const monthSchema = zod_1.z.coerce
    .number()
    .int()
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12");
const yearSchema = zod_1.z.coerce
    .number()
    .int()
    .min(2000, "Year must be 2000 or later")
    .max(2100, "Year must be 2100 or earlier");
const amountSchema = zod_1.z
    .number()
    .positive("Amount must be a positive number")
    .max(9999999999.99, "Amount exceeds maximum allowed value");
const noteSchema = zod_1.z
    .string()
    .trim()
    .max(500, "Note must not exceed 500 characters")
    .optional()
    .nullable();
exports.createBudgetSchema = zod_1.z.object({
    month: monthSchema,
    year: yearSchema,
    totalLimit: amountSchema.optional().nullable(),
    note: noteSchema,
});
exports.updateBudgetSchema = zod_1.z.object({
    totalLimit: amountSchema.optional().nullable(),
    note: noteSchema,
});
exports.budgetIdParamSchema = zod_1.z.object({
    id: common_schema_1.ulidSchema,
});
exports.listBudgetsQuerySchema = zod_1.z.object({
    month: monthSchema.optional(),
    year: yearSchema.optional(),
    page: zod_1.z.coerce
        .number()
        .int()
        .positive("Page must be a positive integer")
        .default(1),
    limit: zod_1.z.coerce
        .number()
        .int()
        .positive("Limit must be a positive integer")
        .max(50, "Limit cannot exceed 50")
        .default(12),
});
exports.budgetAllocationParamsSchema = zod_1.z.object({
    budgetId: common_schema_1.ulidSchema,
});
exports.allocationIdParamSchema = zod_1.z.object({
    budgetId: common_schema_1.ulidSchema,
    id: common_schema_1.ulidSchema,
});
exports.createAllocationSchema = zod_1.z.object({
    categoryId: common_schema_1.ulidSchema,
    amount: amountSchema,
});
exports.updateAllocationSchema = zod_1.z.object({
    amount: amountSchema,
});
