import Razorpay from "razorpay";
import crypto from "node:crypto";
import { nanoid } from "nanoid";
import { paymentConfig } from "../../../config/payment.config";
import type {
  IPaymentProvider,
  CreateOrderResult,
  VerifyPaymentInput,
  VerifyPaymentResult,
  WebhookPayload,
  WebhookResult,
  Currency,
} from "../payment.interface";
import type { SubscriptionPlan } from "../../../generated/prisma/client";

export class RazorpayProvider implements IPaymentProvider {
  readonly provider = "RAZORPAY" as const;
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: paymentConfig.razorpay.keyId,
      key_secret: paymentConfig.razorpay.keySecret,
    });
  }

  /**
   * Create a Razorpay order
   */
  async createOrder(input: {
    amount: number;
    currency: Currency;
    userId: string;
    plan: SubscriptionPlan;
    metadata?: Record<string, string>;
  }): Promise<CreateOrderResult> {
    // Receipt max 40 chars: "rcpt_" (5) + nanoid (21) = 26 chars ✓
    const receipt = `rcpt_${nanoid()}`;

    const order = await this.razorpay.orders.create({
      amount: input.amount, // Amount in paise
      currency: input.currency,
      receipt,
      notes: {
        userId: input.userId,
        plan: input.plan,
        ...input.metadata,
      },
    });

    return {
      success: true,
      orderId: order.id,
      amount: input.amount,
      currency: input.currency,
      provider: "RAZORPAY",
      providerData: {
        keyId: paymentConfig.razorpay.keyId,
        orderId: order.id,
        amount: Number(order.amount),
        currency: order.currency,
      },
    };
  }

  /**
   * Verify Razorpay payment signature
   * Called after frontend receives payment success callback
   */
  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = input;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return {
        success: false,
        paymentId: razorpayPaymentId || "",
        orderId: razorpayOrderId || "",
        provider: "RAZORPAY",
        error: "Missing required Razorpay payment fields",
      };
    }

    // Generate expected signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", paymentConfig.razorpay.keySecret)
      .update(body)
      .digest("hex");

    // Compare signatures (timing-safe comparison)
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpaySignature)
    );

    if (!isValid) {
      return {
        success: false,
        paymentId: razorpayPaymentId,
        orderId: razorpayOrderId,
        provider: "RAZORPAY",
        error: "Invalid payment signature",
      };
    }

    return {
      success: true,
      paymentId: razorpayPaymentId,
      orderId: razorpayOrderId,
      provider: "RAZORPAY",
    };
  }

  /**
   * Handle Razorpay webhook events
   */
  async handleWebhook(payload: WebhookPayload): Promise<WebhookResult> {
    const { rawBody, signature } = payload;

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", paymentConfig.razorpay.webhookSecret)
      .update(rawBody)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );

    if (!isValid) {
      return {
        success: false,
        event: "unknown",
        error: "Invalid webhook signature",
      };
    }

    // Parse the webhook payload
    const event = JSON.parse(rawBody.toString()) as RazorpayWebhookEvent;

    // Handle different event types
    switch (event.event) {
      case "payment.captured":
        return {
          success: true,
          event: "payment.captured",
          paymentId: event.payload.payment.entity.id,
          orderId: event.payload.payment.entity.order_id,
          status: "completed",
        };

      case "payment.failed":
        return {
          success: true,
          event: "payment.failed",
          paymentId: event.payload.payment.entity.id,
          orderId: event.payload.payment.entity.order_id,
          status: "failed",
        };

      case "refund.created":
        return {
          success: true,
          event: "refund.created",
          paymentId: event.payload.refund.entity.payment_id,
          status: "refunded",
        };

      default:
        return {
          success: true,
          event: event.event,
        };
    }
  }
}

// ==================== RAZORPAY WEBHOOK TYPES ====================

interface RazorpayWebhookEvent {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        status: string;
        error_code?: string;
        error_description?: string;
      };
    };
    refund: {
      entity: {
        id: string;
        payment_id: string;
        amount: number;
      };
    };
  };
}
