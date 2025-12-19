"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trendsQuerySchema = exports.categorySummaryQuerySchema = exports.yearlySummaryQuerySchema = exports.monthlySummaryQuerySchema = void 0;
const zod_1 = require("zod");
const client_1 = require("../../generated/prisma/client");
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
const transactionTypeValues = Object.values(client_1.TransactionType);
exports.monthlySummaryQuerySchema = zod_1.z.object({
    month: monthSchema.optional(),
    year: yearSchema.optional(),
});
exports.yearlySummaryQuerySchema = zod_1.z.object({
    year: yearSchema.optional(),
});
exports.categorySummaryQuerySchema = zod_1.z.object({
    month: monthSchema.optional(),
    year: yearSchema.optional(),
    type: zod_1.z.enum(transactionTypeValues).optional(),
});
exports.trendsQuerySchema = zod_1.z.object({
    months: zod_1.z.coerce
        .number()
        .int()
        .min(3, "Minimum 3 months for trends")
        .max(12, "Maximum 12 months for trends")
        .default(6),
});
