import { Prisma, Payment, PaymentStatus } from "../../generated/prisma/client";
import { RepositoryResult } from "../../utils/repository.utils";
export declare class PaymentRepository {
    static createPayment(data: Prisma.PaymentUncheckedCreateInput): Promise<RepositoryResult<Payment>>;
    static findByProviderOrderId(providerOrderId: string): Promise<Payment | null>;
    static findByProviderPaymentId(providerPaymentId: string): Promise<Payment | null>;
    static updatePaymentStatus(id: string, status: PaymentStatus, data?: {
        paidAt?: Date;
        failureReason?: string;
        subscriptionId?: string;
    }): Promise<RepositoryResult<Payment>>;
    static findByUserId(userId: string): Promise<Payment[]>;
    static updateByProviderOrderId(providerOrderId: string, data: {
        status: PaymentStatus;
        providerPaymentId?: string;
        paidAt?: Date;
        failureReason?: string;
        subscriptionId?: string;
    }): Promise<RepositoryResult<Payment>>;
}
