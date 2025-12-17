import { PaymentRepository } from "./payment.repository";
import { SubscriptionRepository } from "../subscription/subscription.repository";
import { PlanPricingRepository } from "../admin/planPricing.repository";
import { getPaymentProvider } from "../../infrastructure/payment";
import { ApiError } from "../../middlewares/error.middleware";
import type { Currency } from "../../types/payment.types";
import type {
  CreateOrderInput,
  VerifyPaymentInput,
} from "./payment.validation";
import logger from "../../config/logger";
import {
  PaymentProvider,
  PaymentStatus,
  SubscriptionPlan,
  SubscriptionStatus,
} from "../../generated/prisma/client";

export class PaymentService {
  /**
   * Create a payment order for subscription purchase
   */
  static async createOrder(userId: string, input: CreateOrderInput) {
    const { plan, currency } = input;

    // Get pricing from database
    const pricing = await PlanPricingRepository.findByPlanAndCurrency(
      plan,
      currency
    );

    if (!pricing) {
      throw new ApiError(
        400,
        `Pricing not available for ${plan} in ${currency}`
      );
    }

    if (!pricing.isActive) {
      throw new ApiError(400, "This plan is currently not available");
    }

    // Get payment provider
    const provider = getPaymentProvider();

    // Create order with provider
    const orderResult = await provider.createOrder({
      amount: pricing.amount,
      currency: currency as Currency,
      userId,
      plan,
    });

    if (!orderResult.success) {
      logger.error("Razorpay order creation failed", {
        userId,
        plan,
        currency,
        error: orderResult.error,
      });
      throw new ApiError(500, orderResult.error);
    }

    // Create pending payment record
    const paymentResult = await PaymentRepository.createPayment({
      userId,
      plan,
      provider: PaymentProvider.RAZORPAY,
      amount: pricing.amount / 100, // Convert paise to rupees for storage
      currency,
      providerOrderId: orderResult.data.orderId,
      status: PaymentStatus.PENDING,
    });

    if (!paymentResult.success) {
      logger.error("Failed to create payment record", {
        userId,
        plan,
        orderId: orderResult.data.orderId,
        error: paymentResult.message,
      });
      throw new ApiError(paymentResult.statusCode, paymentResult.message);
    }

    logger.info("Payment order created", {
      userId,
      plan,
      orderId: orderResult.data.orderId,
      amount: pricing.amount,
      currency,
    });

    return {
      orderId: orderResult.data.orderId,
      amount: pricing.amount,
      currency,
      plan,
      providerData: orderResult.data.providerData,
    };
  }

  /**
   * Verify payment after Razorpay callback (frontend flow)
   *
   * This is called by frontend after user completes payment.
   * If this fails, the Razorpay webhook will handle it as backup.
   */
  static async verifyPayment(userId: string, input: VerifyPaymentInput) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = input;

    // Find the pending payment
    const payment = await PaymentRepository.findByProviderOrderId(
      razorpayOrderId
    );

    if (!payment) {
      logger.warn("Payment verification attempted for unknown order", {
        userId,
        orderId: razorpayOrderId,
      });
      throw new ApiError(404, "Payment not found");
    }

    if (payment.userId !== userId) {
      logger.warn("Payment verification attempted by wrong user", {
        paymentUserId: payment.userId,
        requestUserId: userId,
        orderId: razorpayOrderId,
      });
      throw new ApiError(403, "Payment does not belong to this user");
    }

    // Idempotency: If already completed, return success with subscription
    if (payment.status === PaymentStatus.COMPLETED) {
      logger.info(
        "Payment already completed, returning existing subscription",
        {
          userId,
          orderId: razorpayOrderId,
        }
      );
      const subscription = await SubscriptionRepository.findByUserId(userId);
      return {
        success: true,
        subscription: subscription
          ? {
              id: subscription.id,
              plan: subscription.plan,
              status: subscription.status,
              expiresAt: subscription.expiresAt,
            }
          : null,
      };
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new ApiError(400, "Payment already processed");
    }

    // Step 1: Verify signature with payment provider
    const provider = getPaymentProvider();
    const verifyResult = await provider.verifyPayment({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!verifyResult.success) {
      await PaymentRepository.updatePaymentStatus(
        payment.id,
        PaymentStatus.FAILED,
        { failureReason: verifyResult.error }
      );

      logger.warn("Payment signature verification failed", {
        userId,
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        error: verifyResult.error,
      });

      throw new ApiError(400, "Payment verification failed");
    }

    logger.info("Payment signature verified, processing subscription", {
      userId,
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });

    // Step 2: Process the payment (activate subscription)
    return this.processCompletedPayment(
      payment.id,
      razorpayOrderId,
      razorpayPaymentId,
      userId,
      payment.plan,
      payment.currency
    );
  }

  /**
   * Process a completed payment (called by /verify and webhook)
   * This is the core logic - idempotent and safe to call multiple times
   */
  static async processCompletedPayment(
    paymentId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    userId: string,
    plan: SubscriptionPlan,
    currency: string
  ) {
    // Check if subscription already active for this user (idempotency)
    const existingSubscription = await SubscriptionRepository.findByUserId(
      userId
    );
    if (
      existingSubscription &&
      existingSubscription.status === SubscriptionStatus.ACTIVE &&
      existingSubscription.plan === plan
    ) {
      logger.info("Subscription already active, updating payment record only", {
        userId,
        orderId: razorpayOrderId,
        subscriptionId: existingSubscription.id,
      });

      // Just update payment status and link
      await PaymentRepository.updateByProviderOrderId(razorpayOrderId, {
        status: PaymentStatus.COMPLETED,
        providerPaymentId: razorpayPaymentId,
        paidAt: new Date(),
        subscriptionId: existingSubscription.id,
      });

      return {
        success: true,
        subscription: {
          id: existingSubscription.id,
          plan: existingSubscription.plan,
          status: existingSubscription.status,
          expiresAt: existingSubscription.expiresAt,
        },
      };
    }

    // Mark payment as completed first (critical - we received the money)
    const completedPayment = await PaymentRepository.updateByProviderOrderId(
      razorpayOrderId,
      {
        status: PaymentStatus.COMPLETED,
        providerPaymentId: razorpayPaymentId,
        paidAt: new Date(),
      }
    );

    if (!completedPayment.success) {
      logger.error("CRITICAL: Failed to mark payment as completed", {
        severity: "CRITICAL",
        paymentId,
        orderId: razorpayOrderId,
        razorpayPaymentId,
        userId,
        error: completedPayment.message,
        action: "REQUIRES_MANUAL_INTERVENTION",
        resolution:
          "Check payment status in Razorpay dashboard and update database",
      });
      // Continue anyway - subscription is more important for user
    }

    // Get pricing for duration calculation
    const pricing = await PlanPricingRepository.findByPlanAndCurrency(
      plan,
      currency
    );

    const durationDays =
      pricing?.durationDays ??
      (plan === SubscriptionPlan.PRO_YEARLY ? 365 : 30);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    // Activate subscription (upsert - handles both new and renewal)
    const subscriptionResult =
      await SubscriptionRepository.activateSubscription(
        userId,
        plan,
        expiresAt
      );

    if (!subscriptionResult.success) {
      // CRITICAL: Payment received but subscription activation failed
      logger.error("CRITICAL: Subscription activation failed after payment", {
        severity: "CRITICAL",
        userId,
        paymentId,
        orderId: razorpayOrderId,
        razorpayPaymentId,
        plan,
        currency,
        amount: completedPayment.success
          ? completedPayment.data.amount
          : "unknown",
        error: subscriptionResult.message,
        action: "REQUIRES_MANUAL_INTERVENTION",
        resolution: "Manually activate subscription for user OR process refund",
        userEmail: "Lookup user email from database for notification",
      });

      // Return graceful response - don't expose internal error
      return {
        success: true,
        pending: true,
        message:
          "Payment received successfully. Your subscription is being activated. " +
          "If you don't see it within a few minutes, please contact support.",
        paymentId: razorpayPaymentId,
      };
    }

    // Link subscription to payment record
    const linkResult = await PaymentRepository.updateByProviderOrderId(
      razorpayOrderId,
      {
        status: PaymentStatus.COMPLETED,
        providerPaymentId: razorpayPaymentId,
        paidAt: new Date(),
        subscriptionId: subscriptionResult.data.id,
      }
    );

    if (!linkResult.success) {
      // Not critical - subscription is active, just logging for data consistency
      logger.warn("Failed to link subscription to payment record", {
        paymentId,
        orderId: razorpayOrderId,
        subscriptionId: subscriptionResult.data.id,
        error: linkResult.message,
        note: "User has access - this is a data consistency issue only",
      });
    }

    logger.info("Payment verified and subscription activated successfully", {
      userId,
      orderId: razorpayOrderId,
      razorpayPaymentId,
      subscriptionId: subscriptionResult.data.id,
      plan,
      expiresAt,
      durationDays,
    });

    return {
      success: true,
      subscription: {
        id: subscriptionResult.data.id,
        plan: subscriptionResult.data.plan,
        status: subscriptionResult.data.status,
        expiresAt: subscriptionResult.data.expiresAt,
      },
    };
  }

  /**
   * Handle webhook payment.captured event
   * This is the BACKUP - if /verify failed or wasn't called, this activates subscription
   */
  static async handlePaymentCaptured(
    razorpayPaymentId: string,
    razorpayOrderId: string
  ) {
    logger.info("Webhook: Processing payment.captured event", {
      razorpayPaymentId,
      razorpayOrderId,
    });

    const payment = await PaymentRepository.findByProviderOrderId(
      razorpayOrderId
    );

    if (!payment) {
      logger.warn("Webhook: Payment record not found in database", {
        razorpayOrderId,
        razorpayPaymentId,
        action: "Ignoring webhook - order may be from different system or test",
      });
      return { processed: false, reason: "Payment not found" };
    }

    // Already completed - idempotency check
    if (payment.status === PaymentStatus.COMPLETED) {
      logger.info("Webhook: Payment already completed, nothing to do", {
        razorpayOrderId,
        paymentId: payment.id,
      });
      return { processed: true, reason: "Already completed" };
    }

    // Already failed - log but don't process
    if (payment.status === PaymentStatus.FAILED) {
      logger.warn("Webhook: payment.captured received for FAILED payment", {
        razorpayOrderId,
        paymentId: payment.id,
        note: "This is unusual - payment may have been marked failed prematurely",
      });
      // Still process it - user did pay successfully
    }

    logger.info("Webhook: Activating subscription via webhook backup", {
      razorpayOrderId,
      razorpayPaymentId,
      userId: payment.userId,
      plan: payment.plan,
    });

    // Process the payment
    await this.processCompletedPayment(
      payment.id,
      razorpayOrderId,
      razorpayPaymentId,
      payment.userId,
      payment.plan,
      payment.currency
    );

    return { processed: true };
  }

  /**
   * Handle webhook payment.failed event
   */
  static async handlePaymentFailed(
    razorpayPaymentId: string,
    razorpayOrderId: string,
    errorDescription?: string
  ) {
    logger.info("Webhook: Processing payment.failed event", {
      razorpayPaymentId,
      razorpayOrderId,
      errorDescription,
    });

    const payment = await PaymentRepository.findByProviderOrderId(
      razorpayOrderId
    );

    if (!payment) {
      logger.warn("Webhook: Payment not found for failure event", {
        razorpayOrderId,
      });
      return { processed: false, reason: "Payment not found" };
    }

    // Don't overwrite COMPLETED status with FAILED
    if (payment.status === PaymentStatus.COMPLETED) {
      logger.warn("Webhook: Ignoring payment.failed for COMPLETED payment", {
        razorpayOrderId,
        paymentId: payment.id,
        note: "Payment was already completed - this event may be delayed",
      });
      return { processed: true, reason: "Already completed" };
    }

    if (payment.status !== PaymentStatus.PENDING) {
      return { processed: true, reason: "Already processed" };
    }

    await PaymentRepository.updatePaymentStatus(
      payment.id,
      PaymentStatus.FAILED,
      { failureReason: errorDescription || "Payment failed via webhook" }
    );

    logger.info("Webhook: Payment marked as failed", {
      paymentId: payment.id,
      razorpayOrderId,
      errorDescription,
    });

    return { processed: true };
  }

  /**
   * Get available plans for a currency
   */
  static async getAvailablePlans(currency: string) {
    const allPricing = await PlanPricingRepository.findAllActive();
    const plans = allPricing.filter((p) => p.currency === currency);

    return plans.map((p) => ({
      plan: p.plan,
      name: p.name,
      description: p.description,
      amount: p.amount,
      currency: p.currency,
      durationDays: p.durationDays,
      displayPrice:
        currency === "INR"
          ? `₹${(p.amount / 100).toFixed(2)}`
          : `$${(p.amount / 100).toFixed(2)}`,
    }));
  }

  /**
   * Get payment history for a user
   */
  static async getPaymentHistory(userId: string) {
    const payments = await PaymentRepository.findByUserId(userId);

    return payments.map((p) => ({
      id: p.id,
      plan: p.plan,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      paidAt: p.paidAt,
      createdAt: p.createdAt,
    }));
  }
}
