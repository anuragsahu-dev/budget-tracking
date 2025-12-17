import type { SubscriptionPlan } from "../generated/prisma/client";

// ==================== COMMON TYPES ====================

export type Currency = "INR" | "USD";

export interface PlanPricing {
  amount: number; // Amount in smallest unit (paise for INR, cents for USD)
  currency: Currency;
  durationDays: number;
}

// ==================== PROVIDER RESULT TYPES (discriminated union) ====================

export interface ProviderOrderData {
  orderId: string;
  providerData: {
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
  };
}

export type CreateOrderResult =
  | { success: true; data: ProviderOrderData }
  | { success: false; error: string };

export type VerifyPaymentResult =
  | { success: true }
  | { success: false; error: string };

export type WebhookResult =
  | {
      success: true;
      event: string;
      paymentId?: string;
      orderId?: string;
      status?: "completed" | "failed" | "refunded";
    }
  | { success: false; event: string; error: string };

// ==================== INPUT TYPES ====================

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

// ==================== PROVIDER INTERFACE ====================

export interface IPaymentProvider {
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;
  handleWebhook(payload: WebhookPayload): Promise<WebhookResult>;
}
