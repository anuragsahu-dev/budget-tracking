import type { SubscriptionPlan } from "../generated/prisma/client";
export type Currency = "INR" | "USD";
export interface PlanPricing {
    amount: number;
    currency: Currency;
    durationDays: number;
}
export interface ProviderOrderData {
    orderId: string;
    providerData: {
        keyId: string;
        orderId: string;
        amount: number;
        currency: string;
    };
}
export type CreateOrderResult = {
    success: true;
    data: ProviderOrderData;
} | {
    success: false;
    error: string;
};
export type VerifyPaymentResult = {
    success: true;
} | {
    success: false;
    error: string;
};
export type WebhookResult = {
    success: true;
    event: string;
    paymentId?: string;
    orderId?: string;
    status?: "completed" | "failed" | "refunded";
} | {
    success: false;
    event: string;
    error: string;
};
export interface CreateOrderInput {
    amount: number;
    currency: Currency;
    userId: string;
    plan: SubscriptionPlan;
    metadata?: Record<string, string>;
}
export interface VerifyPaymentInput {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}
export interface WebhookPayload {
    rawBody: string | Buffer;
    signature: string;
}
export interface IPaymentProvider {
    createOrder(input: CreateOrderInput): Promise<CreateOrderResult>;
    verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;
    handleWebhook(payload: WebhookPayload): Promise<WebhookResult>;
}
