import type {
  PaymentProvider,
  SubscriptionPlan,
} from "../generated/prisma/client";

// ==================== COMMON TYPES ====================

export type Currency = "INR" | "USD";

export interface PlanPricing {
  amount: number; // Amount in smallest unit (paise for INR, cents for USD)
  currency: Currency;
  durationDays: number;
}

// ==================== ORDER/PAYMENT TYPES ====================

export interface CreateOrderInput {
  plan: SubscriptionPlan;
  userId: string;
  currency: Currency;
}

export interface CreateOrderResult {
  success: true;
  orderId: string; // Razorpay order_id
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
  // Provider-specific data for frontend
  providerData: {
    keyId: string; // Razorpay key_id for checkout
    orderId: string;
    amount: number;
    currency: string;
  };
}

export interface VerifyPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  paymentId: string;
  orderId: string;
  provider: PaymentProvider;
  error?: string;
}

// ==================== WEBHOOK TYPES ====================

export interface WebhookPayload {
  rawBody: string | Buffer;
  signature: string;
}

export interface WebhookResult {
  success: boolean;
  event: string;
  paymentId?: string;
  orderId?: string;
  status?: "completed" | "failed" | "refunded";
  error?: string;
}

// ==================== PROVIDER INTERFACE ====================
// This is the contract that both Razorpay and Stripe (future) providers must follow

export interface IPaymentProvider {
  readonly provider: PaymentProvider;

  /**
   * Create an order/payment intent
   */
  createOrder(input: {
    amount: number;
    currency: Currency;
    userId: string;
    plan: SubscriptionPlan;
    metadata?: Record<string, string>;
  }): Promise<CreateOrderResult>;

  /**
   * Verify payment signature
   */
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;

  /**
   * Process webhook events
   */
  handleWebhook(payload: WebhookPayload): Promise<WebhookResult>;
}
