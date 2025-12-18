"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planPricingIdParamSchema = exports.updatePlanPricingSchema = exports.createPlanPricingSchema = exports.paymentIdParamSchema = exports.listPaymentsQuerySchema = exports.statsQuerySchema = exports.listUsersQuerySchema = exports.updateUserStatusSchema = exports.userIdParamSchema = exports.systemCategoryIdParamSchema = exports.updateSystemCategorySchema = exports.createSystemCategorySchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("../../validations/common.schema");
const client_1 = require("../../generated/prisma/client");
const paymentStatusValues = Object.values(client_1.PaymentStatus);
const subscriptionPlanValues = Object.values(client_1.SubscriptionPlan);
const hexColorSchema = zod_1.z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format (e.g., #FF5733)")
    .nullable()
    .optional();
const categoryNameSchema = zod_1.z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must not exceed 50 characters");
exports.createSystemCategorySchema = zod_1.z.object({
    name: categoryNameSchema,
    color: hexColorSchema,
});
exports.updateSystemCategorySchema = zod_1.z.object({
    name: categoryNameSchema.optional(),
    color: hexColorSchema,
});
exports.systemCategoryIdParamSchema = zod_1.z.object({
    id: common_schema_1.ulidSchema,
});
const userRoleValues = Object.values(client_1.UserRole);
const userStatusValues = Object.values(client_1.UserStatus);
exports.userIdParamSchema = zod_1.z.object({
    id: common_schema_1.ulidSchema,
});
exports.updateUserStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(userStatusValues),
});
exports.listUsersQuerySchema = zod_1.z.object({
    role: zod_1.z.enum(userRoleValues).optional(),
    status: zod_1.z.enum(userStatusValues).optional(),
    search: zod_1.z.string().trim().max(100).optional(),
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
    sortBy: zod_1.z.enum(["createdAt", "fullName", "email"]).default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
exports.statsQuerySchema = zod_1.z.object({
    from: zod_1.z.coerce.date().optional(),
    to: zod_1.z.coerce.date().optional(),
});
exports.listPaymentsQuerySchema = zod_1.z.object({
    userId: zod_1.z.string().optional(),
    status: zod_1.z.enum(paymentStatusValues).optional(),
    plan: zod_1.z.enum(subscriptionPlanValues).optional(),
    from: zod_1.z.coerce.date().optional(),
    to: zod_1.z.coerce.date().optional(),
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
    sortBy: zod_1.z.enum(["createdAt", "amount", "status"]).default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
exports.paymentIdParamSchema = zod_1.z.object({
    id: common_schema_1.ulidSchema,
});
const currencySchema = zod_1.z
    .string()
    .length(3, "Currency must be 3 characters (e.g., INR, USD)");
exports.createPlanPricingSchema = zod_1.z.object({
    plan: zod_1.z.enum(subscriptionPlanValues),
    currency: currencySchema,
    amount: zod_1.z
        .number()
        .int()
        .positive("Amount must be positive (in smallest unit)"),
    durationDays: zod_1.z.number().int().positive("Duration must be positive"),
    name: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().max(500).optional().nullable(),
    isActive: zod_1.z.boolean().default(true),
});
exports.updatePlanPricingSchema = zod_1.z.object({
    amount: zod_1.z.number().int().positive("Amount must be positive").optional(),
    durationDays: zod_1.z
        .number()
        .int()
        .positive("Duration must be positive")
        .optional(),
    name: zod_1.z.string().min(2).max(100).optional(),
    description: zod_1.z.string().max(500).optional().nullable(),
    isActive: zod_1.z.boolean().optional(),
});
exports.planPricingIdParamSchema = zod_1.z.object({
    id: common_schema_1.ulidSchema,
});
