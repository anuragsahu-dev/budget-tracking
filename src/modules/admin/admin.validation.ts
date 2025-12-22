import { z } from "zod";
import { ulidSchema } from "../../validations/common.schema";
import {
  UserStatus,
  PaymentStatus,
  SubscriptionPlan,
  SubscriptionStatus,
} from "../../generated/prisma/client";

// Extract enum values for Zod compatibility
const paymentStatusValues = Object.values(PaymentStatus) as [
  PaymentStatus,
  ...PaymentStatus[]
];
const subscriptionPlanValues = Object.values(SubscriptionPlan) as [
  SubscriptionPlan,
  ...SubscriptionPlan[]
];

// ========== SYSTEM CATEGORY SCHEMAS ==========

const hexColorSchema = z
  .string()
  .regex(
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    "Invalid hex color format (e.g., #FF5733)"
  )
  .nullable()
  .optional();

const categoryNameSchema = z
  .string()
  .trim()
  .min(2, "Category name must be at least 2 characters")
  .max(50, "Category name must not exceed 50 characters");

export const createSystemCategorySchema = z.object({
  name: categoryNameSchema,
  color: hexColorSchema,
});

export type CreateSystemCategoryInput = z.infer<
  typeof createSystemCategorySchema
>;

export const updateSystemCategorySchema = z.object({
  name: categoryNameSchema.optional(),
  color: hexColorSchema,
});

export type UpdateSystemCategoryInput = z.infer<
  typeof updateSystemCategorySchema
>;

export const systemCategoryIdParamSchema = z.object({
  id: ulidSchema,
});

export type SystemCategoryIdParam = z.infer<typeof systemCategoryIdParamSchema>;

// ========== USER MANAGEMENT SCHEMAS ==========

// Extract enum values for Zod compatibility
const userStatusValues = Object.values(UserStatus) as [
  UserStatus,
  ...UserStatus[]
];

export const userIdParamSchema = z.object({
  id: ulidSchema,
});

export type UserIdParam = z.infer<typeof userIdParamSchema>;

export const updateUserStatusSchema = z.object({
  status: z.enum(userStatusValues),
});

export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;

export const listUsersQuerySchema = z.object({
  status: z.enum(userStatusValues).optional(),
  search: z.string().trim().max(100).optional(),
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
  sortBy: z.enum(["createdAt", "fullName", "email"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

// ========== STATISTICS SCHEMA ==========

export const statsQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type StatsQuery = z.infer<typeof statsQuerySchema>;

// ========== PAYMENT MANAGEMENT SCHEMAS ==========

export const listPaymentsQuerySchema = z.object({
  userId: z.string().optional(),
  status: z.enum(paymentStatusValues).optional(),
  plan: z.enum(subscriptionPlanValues).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
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
  sortBy: z.enum(["createdAt", "amount", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ListPaymentsQuery = z.infer<typeof listPaymentsQuerySchema>;

export const paymentIdParamSchema = z.object({
  id: ulidSchema,
});

export type PaymentIdParam = z.infer<typeof paymentIdParamSchema>;

// Admin update payment (for manual intervention)
export const updatePaymentSchema = z.object({
  status: z.enum(paymentStatusValues).optional(),
  subscriptionId: z.string().optional(),
  failureReason: z.string().max(500).optional().nullable(),
});

export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;

// ========== PLAN PRICING SCHEMAS ==========

const currencySchema = z
  .string()
  .length(3, "Currency must be 3 characters (e.g., INR, USD)");

export const createPlanPricingSchema = z.object({
  plan: z.enum(subscriptionPlanValues),
  currency: currencySchema,
  amount: z
    .number()
    .int()
    .positive("Amount must be positive (in smallest unit)"),
  durationDays: z.number().int().positive("Duration must be positive"),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional().nullable(),
  isActive: z.boolean().default(true),
});

export type CreatePlanPricingInput = z.infer<typeof createPlanPricingSchema>;

export const updatePlanPricingSchema = z.object({
  amount: z.number().int().positive("Amount must be positive").optional(),
  durationDays: z
    .number()
    .int()
    .positive("Duration must be positive")
    .optional(),
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  isActive: z.boolean().optional(),
});

export type UpdatePlanPricingInput = z.infer<typeof updatePlanPricingSchema>;

export const planPricingIdParamSchema = z.object({
  id: ulidSchema,
});

export type PlanPricingIdParam = z.infer<typeof planPricingIdParamSchema>;

// ========== SUBSCRIPTION MANAGEMENT SCHEMAS ==========

const subscriptionStatusValues = Object.values(SubscriptionStatus) as [
  SubscriptionStatus,
  ...SubscriptionStatus[]
];

export const listSubscriptionsQuerySchema = z.object({
  status: z.enum(subscriptionStatusValues).optional(),
  plan: z.enum(subscriptionPlanValues).optional(),
  expiringWithinDays: z.coerce.number().int().positive().optional(),
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
  sortBy: z.enum(["createdAt", "expiresAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ListSubscriptionsQuery = z.infer<
  typeof listSubscriptionsQuerySchema
>;

export const subscriptionIdParamSchema = z.object({
  id: ulidSchema,
});

export type SubscriptionIdParam = z.infer<typeof subscriptionIdParamSchema>;

export const updateSubscriptionSchema = z.object({
  status: z.enum(subscriptionStatusValues).optional(),
  plan: z.enum(subscriptionPlanValues).optional(),
  extendDays: z
    .number()
    .int()
    .positive("Extension days must be positive")
    .optional(),
  expiresAt: z.coerce.date().optional(), // Set exact expiry date
});

export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;

// Admin create subscription (for manual intervention when payment succeeded but subscription failed)
export const createSubscriptionSchema = z.object({
  userId: ulidSchema,
  plan: z.enum(subscriptionPlanValues),
  expiresAt: z.coerce.date(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
