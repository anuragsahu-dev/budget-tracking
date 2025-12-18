import { z } from "zod";
export declare const createSystemCategorySchema: z.ZodObject<{
    name: z.ZodString;
    color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CreateSystemCategoryInput = z.infer<typeof createSystemCategorySchema>;
export declare const updateSystemCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type UpdateSystemCategoryInput = z.infer<typeof updateSystemCategorySchema>;
export declare const systemCategoryIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type SystemCategoryIdParam = z.infer<typeof systemCategoryIdParamSchema>;
export declare const userIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export declare const updateUserStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
        SUSPENDED: "SUSPENDED";
        DELETED: "DELETED";
    }>;
}, z.core.$strip>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export declare const listUsersQuerySchema: z.ZodObject<{
    role: z.ZodOptional<z.ZodEnum<{
        USER: "USER";
        ADMIN: "ADMIN";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
        SUSPENDED: "SUSPENDED";
        DELETED: "DELETED";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        email: "email";
        fullName: "fullName";
        createdAt: "createdAt";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export declare const statsQuerySchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    to: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type StatsQuery = z.infer<typeof statsQuerySchema>;
export declare const listPaymentsQuerySchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        COMPLETED: "COMPLETED";
        FAILED: "FAILED";
        REFUNDED: "REFUNDED";
    }>>;
    plan: z.ZodOptional<z.ZodEnum<{
        PRO_MONTHLY: "PRO_MONTHLY";
        PRO_YEARLY: "PRO_YEARLY";
    }>>;
    from: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    to: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        status: "status";
        amount: "amount";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type ListPaymentsQuery = z.infer<typeof listPaymentsQuerySchema>;
export declare const paymentIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type PaymentIdParam = z.infer<typeof paymentIdParamSchema>;
export declare const createPlanPricingSchema: z.ZodObject<{
    plan: z.ZodEnum<{
        PRO_MONTHLY: "PRO_MONTHLY";
        PRO_YEARLY: "PRO_YEARLY";
    }>;
    currency: z.ZodString;
    amount: z.ZodNumber;
    durationDays: z.ZodNumber;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type CreatePlanPricingInput = z.infer<typeof createPlanPricingSchema>;
export declare const updatePlanPricingSchema: z.ZodObject<{
    amount: z.ZodOptional<z.ZodNumber>;
    durationDays: z.ZodOptional<z.ZodNumber>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdatePlanPricingInput = z.infer<typeof updatePlanPricingSchema>;
export declare const planPricingIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type PlanPricingIdParam = z.infer<typeof planPricingIdParamSchema>;
