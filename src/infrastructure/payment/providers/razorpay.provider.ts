import Razorpay from "razorpay";
import crypto from "node:crypto";
import { nanoid } from "nanoid";
import { paymentConfig } from "../../../config/payment.config";
import type {
  IPaymentProvider,
  CreateOrderInput,
  CreateOrderResult,
  VerifyPaymentInput,
  VerifyPaymentResult,
  WebhookPayload,
  WebhookResult,
} from "../payment.interface";
import logger from "../../../config/logger";

export class RazorpayProvider implements IPaymentProvider {
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
  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const receipt = `rcpt_${nanoid()}`; // Max 40 chars: "rcpt_" (5) + nanoid (21) = 26 chars

    try {
      const order = await this.razorpay.orders.create({
        amount: input.amount,
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
        data: {
          orderId: order.id,
          providerData: {
            keyId: paymentConfig.razorpay.keyId,
            orderId: order.id,
            amount: Number(order.amount),
            currency: order.currency,
          },
        },
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Razorpay error";
      logger.error("Razorpay order creation failed", { error: message });
      return { success: false, error: message };
    }
  }

  /**
   * Verify Razorpay payment signature
   */
  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = input;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return { success: false, error: "Missing required payment fields" };
    }

    try {
      const body = `${razorpayOrderId}|${razorpayPaymentId}`;
      const expectedSignature = crypto
        .createHmac("sha256", paymentConfig.razorpay.keySecret)
        .update(body)
        .digest("hex");

      // Buffer length check before timing-safe comparison
      if (expectedSignature.length !== razorpaySignature.length) {
        return { success: false, error: "Invalid payment signature" };
      }

      const isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpaySignature)
      );

      if (!isValid) {
        return { success: false, error: "Invalid payment signature" };
      }

      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Signature verification error";
      logger.error("Payment verification failed", { error: message });
      return { success: false, error: "Payment verification failed" };
    }
  }

  /**
   * Handle Razorpay webhook events
   */
  async handleWebhook(payload: WebhookPayload): Promise<WebhookResult> {
    const { rawBody, signature } = payload;

    try {
      const expectedSignature = crypto
        .createHmac("sha256", paymentConfig.razorpay.webhookSecret)
        .update(rawBody)
        .digest("hex");

      // Buffer length check before timing-safe comparison
      if (expectedSignature.length !== signature.length) {
        return {
          success: false,
          event: "unknown",
          error: "Invalid webhook signature",
        };
      }

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

      const event = JSON.parse(rawBody.toString()) as RazorpayWebhookEvent;

      switch (event.event) {
        case "payment.captured":
          if (!event.payload.payment) {
            return {
              success: false,
              event: event.event,
              error: "Missing payment payload",
            };
          }
          return {
            success: true,
            event: "payment.captured",
            paymentId: event.payload.payment.entity.id,
            orderId: event.payload.payment.entity.order_id,
            status: "completed",
          };

        case "payment.failed":
          if (!event.payload.payment) {
            return {
              success: false,
              event: event.event,
              error: "Missing payment payload",
            };
          }
          return {
            success: true,
            event: "payment.failed",
            paymentId: event.payload.payment.entity.id,
            orderId: event.payload.payment.entity.order_id,
            status: "failed",
          };

        case "refund.created":
          if (!event.payload.refund) {
            return {
              success: false,
              event: event.event,
              error: "Missing refund payload",
            };
          }
          return {
            success: true,
            event: "refund.created",
            paymentId: event.payload.refund.entity.payment_id,
            status: "refunded",
          };

        default:
          return { success: true, event: event.event };
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Webhook processing error";
      logger.error("Webhook processing failed", { error: message });
      return {
        success: false,
        event: "unknown",
        error: "Webhook processing failed",
      };
    }
  }
}

// ==================== RAZORPAY WEBHOOK TYPES ====================

interface RazorpayWebhookEvent {
  event: string;
  payload: {
    payment?: {
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
    refund?: {
      entity: {
        id: string;
        payment_id: string;
        amount: number;
      };
    };
  };
}
