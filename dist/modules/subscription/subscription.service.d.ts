import { SubscriptionStatus } from "../../generated/prisma/client";
export declare class SubscriptionService {
    static getSubscription(userId: string): Promise<{
        id: string;
        plan: import("../../generated/prisma/enums").SubscriptionPlan;
        status: SubscriptionStatus;
        expiresAt: Date;
        hasAccess: boolean;
        daysRemaining: number;
        isCancelled: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    static getSubscriptionWithHistory(userId: string): Promise<{
        subscription: null;
        payments: never[];
    } | {
        subscription: {
            id: string;
            plan: import("../../generated/prisma/enums").SubscriptionPlan;
            status: SubscriptionStatus;
            expiresAt: Date;
            hasAccess: boolean;
            isCancelled: boolean;
            createdAt: Date;
        };
        payments: {
            id: string;
            plan: import("../../generated/prisma/enums").SubscriptionPlan;
            amount: import("@prisma/client-runtime-utils").Decimal;
            currency: string;
            status: import("../../generated/prisma/enums").PaymentStatus;
            paidAt: Date | null;
            createdAt: Date;
        }[];
    }>;
    static cancelSubscription(userId: string): Promise<{
        message: string;
        expiresAt: Date;
        daysRemaining: number;
    }>;
    static hasActiveSubscription(userId: string): Promise<boolean>;
    private static checkHasAccess;
}
