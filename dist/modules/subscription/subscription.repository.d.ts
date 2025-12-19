import { Subscription, SubscriptionPlan, SubscriptionStatus } from "../../generated/prisma/client";
import { RepositoryResult } from "../../utils/repository.utils";
export declare class SubscriptionRepository {
    static findByUserId(userId: string): Promise<Subscription | null>;
    static createSubscription(data: {
        userId: string;
        plan: SubscriptionPlan;
        status: SubscriptionStatus;
        expiresAt: Date;
    }): Promise<RepositoryResult<Subscription>>;
    static updateSubscription(userId: string, data: {
        plan?: SubscriptionPlan;
        status?: SubscriptionStatus;
        expiresAt?: Date;
    }): Promise<RepositoryResult<Subscription>>;
    static activateSubscription(userId: string, plan: SubscriptionPlan, expiresAt: Date): Promise<RepositoryResult<Subscription>>;
    static markExpiredSubscriptions(): Promise<number>;
    static cancelSubscription(userId: string): Promise<RepositoryResult<Subscription>>;
    static findWithPayments(userId: string): Promise<({
        payments: {
            id: string;
            createdAt: Date;
            userId: string;
            currency: string;
            status: import("../../generated/prisma/enums").PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
            plan: SubscriptionPlan;
            provider: import("../../generated/prisma/enums").PaymentProvider;
            providerPaymentId: string | null;
            providerOrderId: string;
            failureReason: string | null;
            paidAt: Date | null;
            subscriptionId: string | null;
        }[];
    } & {
        id: string;
        expiresAt: Date;
        createdAt: Date;
        userId: string;
        status: SubscriptionStatus;
        updatedAt: Date;
        plan: SubscriptionPlan;
    }) | null>;
}
