import type { CreateSystemCategoryInput, UpdateSystemCategoryInput, ListUsersQuery, UpdateUserStatusInput, StatsQuery, ListPaymentsQuery, CreatePlanPricingInput, UpdatePlanPricingInput } from "./admin.validation";
export declare class AdminService {
    static getAllSystemCategories(): Promise<{
        id: string;
        name: string;
        slug: string;
        color: string | null;
        createdAt: Date;
    }[]>;
    static createSystemCategory(data: CreateSystemCategoryInput): Promise<{
        id: string;
        name: string;
        slug: string;
        color: string | null;
        createdAt: Date;
    }>;
    static updateSystemCategory(categoryId: string, data: UpdateSystemCategoryInput): Promise<{
        id: string;
        name: string;
        slug: string;
        color: string | null;
        createdAt: Date;
    }>;
    static deleteSystemCategory(categoryId: string): Promise<{
        message: string;
    }>;
    static getAllUsers(query: ListUsersQuery): Promise<{
        users: import("./admin.types").SafeUser[];
        meta: import("../../utils").PaginationMeta;
    }>;
    static getUserById(userId: string): Promise<import("./admin.types").SafeUser>;
    static updateUserStatus(userId: string, adminId: string, data: UpdateUserStatusInput): Promise<import("./admin.types").SafeUser>;
    static getStats(query: StatsQuery): Promise<{
        totalUsers: number;
        activeUsers: number;
        newUsers: number;
        totalTransactions: number;
        totalBudgets: number;
    }>;
    static getAllPayments(query: ListPaymentsQuery): Promise<{
        payments: {
            id: string;
            createdAt: Date;
            userId: string;
            currency: string;
            status: import("../../generated/prisma/enums").PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
            plan: import("../../generated/prisma/enums").SubscriptionPlan;
            provider: import("../../generated/prisma/enums").PaymentProvider;
            providerPaymentId: string | null;
            providerOrderId: string;
            failureReason: string | null;
            paidAt: Date | null;
            subscriptionId: string | null;
        }[];
        meta: import("../../utils").PaginationMeta;
    }>;
    static getPaymentById(paymentId: string): Promise<{
        user: {
            email: string;
            fullName: string | null;
            id: string;
        };
        subscription: {
            id: string;
            expiresAt: Date;
            createdAt: Date;
            userId: string;
            status: import("../../generated/prisma/enums").SubscriptionStatus;
            updatedAt: Date;
            plan: import("../../generated/prisma/enums").SubscriptionPlan;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        currency: string;
        status: import("../../generated/prisma/enums").PaymentStatus;
        amount: import("@prisma/client-runtime-utils").Decimal;
        plan: import("../../generated/prisma/enums").SubscriptionPlan;
        provider: import("../../generated/prisma/enums").PaymentProvider;
        providerPaymentId: string | null;
        providerOrderId: string;
        failureReason: string | null;
        paidAt: Date | null;
        subscriptionId: string | null;
    }>;
    static getPaymentStats(query: StatsQuery): Promise<{
        totalPayments: number;
        completedPayments: number;
        pendingPayments: number;
        failedPayments: number;
        refundedPayments: number;
        totalRevenue: number;
    }>;
    static getAllPlanPricing(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        currency: string;
        updatedAt: Date;
        amount: number;
        description: string | null;
        plan: import("../../generated/prisma/enums").SubscriptionPlan;
        isActive: boolean;
        durationDays: number;
    }[]>;
    static getActivePlanPricing(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        currency: string;
        updatedAt: Date;
        amount: number;
        description: string | null;
        plan: import("../../generated/prisma/enums").SubscriptionPlan;
        isActive: boolean;
        durationDays: number;
    }[]>;
    static createPlanPricing(data: CreatePlanPricingInput): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        currency: string;
        updatedAt: Date;
        amount: number;
        description: string | null;
        plan: import("../../generated/prisma/enums").SubscriptionPlan;
        isActive: boolean;
        durationDays: number;
    }>;
    static updatePlanPricing(pricingId: string, data: UpdatePlanPricingInput): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        currency: string;
        updatedAt: Date;
        amount: number;
        description: string | null;
        plan: import("../../generated/prisma/enums").SubscriptionPlan;
        isActive: boolean;
        durationDays: number;
    }>;
    static deletePlanPricing(pricingId: string): Promise<{
        message: string;
    }>;
}
