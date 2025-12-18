import { Prisma, Category, UserStatus, Payment, PaymentStatus } from "../../generated/prisma/client";
import { RepositoryResult, PaginatedResult } from "../../utils/repository.utils";
import { CategoryRepository } from "../category/category.repository";
import type { SafeUser, UserFilters, PaginationOptions, PaymentFilters } from "./admin.types";
export type { SafeUser, UserFilters, PaginationOptions };
export declare class AdminRepository {
    static findAllSystemCategories(): Promise<Category[]>;
    static findSystemCategoryById(id: string): Promise<Category | null>;
    static findSystemCategoryBySlug: typeof CategoryRepository.findSystemCategoryBySlug;
    static createSystemCategory(data: Omit<Prisma.CategoryCreateInput, "user">): Promise<RepositoryResult<Category>>;
    static updateSystemCategory(id: string, data: Prisma.CategoryUpdateInput): Promise<RepositoryResult<Category>>;
    static deleteSystemCategory(id: string): Promise<RepositoryResult<Category>>;
    static systemCategoryHasTransactions: typeof CategoryRepository.hasTransactions;
    static systemCategoryHasBudgetAllocations: typeof CategoryRepository.hasBudgetAllocations;
    static findAllUsers(filters: UserFilters, pagination: PaginationOptions): Promise<PaginatedResult<SafeUser>>;
    static findUserById(id: string): Promise<SafeUser | null>;
    static updateUserStatus(id: string, status: UserStatus): Promise<RepositoryResult<SafeUser>>;
    static getStats(from?: Date, to?: Date): Promise<{
        totalUsers: number;
        activeUsers: number;
        newUsers: number;
        totalTransactions: number;
        totalBudgets: number;
    }>;
    static findAllPayments(filters: PaymentFilters, pagination: PaginationOptions): Promise<PaginatedResult<Payment>>;
    static findPaymentById(id: string): Promise<({
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
        status: PaymentStatus;
        amount: import("@prisma/client-runtime-utils").Decimal;
        plan: import("../../generated/prisma/enums").SubscriptionPlan;
        provider: import("../../generated/prisma/enums").PaymentProvider;
        providerPaymentId: string | null;
        providerOrderId: string;
        failureReason: string | null;
        paidAt: Date | null;
        subscriptionId: string | null;
    }) | null>;
    static getPaymentStats(from?: Date, to?: Date): Promise<{
        totalPayments: number;
        completedPayments: number;
        pendingPayments: number;
        failedPayments: number;
        refundedPayments: number;
        totalRevenue: number;
    }>;
}
