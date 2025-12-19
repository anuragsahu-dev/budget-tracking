import type { CreateOrderInput, VerifyPaymentInput } from "./payment.validation";
import { PaymentStatus, SubscriptionPlan, SubscriptionStatus } from "../../generated/prisma/client";
export declare class PaymentService {
    static createOrder(userId: string, input: CreateOrderInput): Promise<{
        orderId: string;
        amount: number;
        currency: "INR" | "USD";
        plan: "PRO_MONTHLY" | "PRO_YEARLY";
        providerData: {
            keyId: string;
            orderId: string;
            amount: number;
            currency: string;
        };
    }>;
    static verifyPayment(userId: string, input: VerifyPaymentInput): Promise<{
        success: boolean;
        pending: boolean;
        message: string;
        paymentId: string;
        subscription?: undefined;
    } | {
        success: boolean;
        subscription: {
            id: string;
            plan: SubscriptionPlan;
            status: SubscriptionStatus;
            expiresAt: Date;
        } | null;
    }>;
    static processCompletedPayment(paymentId: string, razorpayOrderId: string, razorpayPaymentId: string, userId: string, plan: SubscriptionPlan, currency: string): Promise<{
        success: boolean;
        pending: boolean;
        message: string;
        paymentId: string;
        subscription?: undefined;
    } | {
        success: boolean;
        subscription: {
            id: string;
            plan: SubscriptionPlan;
            status: SubscriptionStatus;
            expiresAt: Date;
        };
        pending?: undefined;
        message?: undefined;
        paymentId?: undefined;
    }>;
    static handlePaymentCaptured(razorpayPaymentId: string, razorpayOrderId: string): Promise<{
        processed: boolean;
        reason: string;
    } | {
        processed: boolean;
        reason?: undefined;
    }>;
    static handlePaymentFailed(razorpayPaymentId: string, razorpayOrderId: string, errorDescription?: string): Promise<{
        processed: boolean;
        reason: string;
    } | {
        processed: boolean;
        reason?: undefined;
    }>;
    static getAvailablePlans(currency: string): Promise<{
        plan: SubscriptionPlan;
        name: string;
        description: string | null;
        amount: number;
        currency: string;
        durationDays: number;
        displayPrice: string;
    }[]>;
    static getPaymentHistory(userId: string): Promise<{
        id: string;
        plan: SubscriptionPlan;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        status: PaymentStatus;
        paidAt: Date | null;
        createdAt: Date;
    }[]>;
}
