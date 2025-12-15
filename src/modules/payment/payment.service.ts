import { PaymentRepository } from "./payment.repository";
import { SubscriptionRepository } from "../subscription/subscription.repository";
import { getPaymentProvider } from "../../infrastructure/payment";
import { getPlanPricing } from "../../config/payment.config";
import { ApiError } from "../../middlewares/error.middleware";
import type { SubscriptionPlan } from "../../generated/prisma/client";
import type { Currency } from "../../types/payment.types";
import type {
  CreateOrderInput,
  VerifyPaymentInput,
} from "./payment.validation";
import logger from "../../config/logger";

export class PaymentService {
  /**
   * Create a payment order for subscription purchase
   */
  static async createOrder(userId: string, input: CreateOrderInput) {
    const { plan, currency } = input;

    // Get pricing for the plan
    const pricing = getPlanPricing(plan, currency as Currency);

    // Get payment provider (Razorpay)
    const provider = getPaymentProvider();

    // Create order with provider
    const orderResult = await provider.createOrder({
      amount: pricing.amount,
      currency: currency as Currency,
      userId,
      plan,
    });

    // Create pending payment record in database
    const paymentResult = await PaymentRepository.createPayment({
      userId,
      plan,
      provider: "RAZORPAY",
      amount: pricing.amount / 100, // Convert paise to rupees for storage
      currency,
      providerPaymentId: `pending_${orderResult.orderId}`, // Temporary, updated after payment
      providerOrderId: orderResult.orderId,
      status: "PENDING",
    });

    if (!paymentResult.success) {
      throw new ApiError(500, "Failed to create payment record");
    }

    logger.info("Payment order created", {
      userId,
      plan,
      orderId: orderResult.orderId,
    });

    return {
      orderId: orderResult.orderId,
      amount: pricing.amount,
      currency,
      plan,
      providerData: orderResult.providerData,
    };
  }

  /**
   * Verify payment after Razorpay callback
   */
  static async verifyPayment(userId: string, input: VerifyPaymentInput) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = input;

    // Find the pending payment
    const payment = await PaymentRepository.findByProviderOrderId(
      razorpayOrderId
    );

    if (!payment) {
      throw new ApiError(404, "Payment not found");
    }

    if (payment.userId !== userId) {
      throw new ApiError(403, "Payment does not belong to this user");
    }

    if (payment.status !== "PENDING") {
      throw new ApiError(400, "Payment already processed");
    }

    // Verify with payment provider
    const provider = getPaymentProvider();
    const verifyResult = await provider.verifyPayment({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!verifyResult.success) {
      // Update payment as failed
      await PaymentRepository.updatePaymentStatus(payment.id, "FAILED", {
        failureReason: verifyResult.error || "Signature verification failed",
      });

      logger.warn("Payment verification failed", {
        userId,
        orderId: razorpayOrderId,
        error: verifyResult.error,
      });

      throw new ApiError(400, "Payment verification failed");
    }

    // Calculate expiry date based on plan
    const pricing = getPlanPricing(payment.plan, payment.currency as Currency);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + pricing.durationDays);

    // Activate subscription
    const subscriptionResult =
      await SubscriptionRepository.activateSubscription(
        userId,
        payment.plan,
        expiresAt
      );

    if (!subscriptionResult.success) {
      throw new ApiError(500, "Failed to activate subscription");
    }

    // Update payment as completed
    await PaymentRepository.updatePaymentStatus(payment.id, "COMPLETED", {
      paidAt: new Date(),
      subscriptionId: subscriptionResult.data.id,
    });

    // Update providerPaymentId with actual payment ID
    await PaymentRepository.updateByProviderOrderId(razorpayOrderId, {
      status: "COMPLETED",
      providerPaymentId: razorpayPaymentId,
      paidAt: new Date(),
      subscriptionId: subscriptionResult.data.id,
    });

    logger.info("Payment verified and subscription activated", {
      userId,
      plan: payment.plan,
      expiresAt,
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
   * Get payment history for user
   */
  static async getPaymentHistory(userId: string) {
    const payments = await PaymentRepository.findByUserId(userId);

    return payments.map((payment) => ({
      id: payment.id,
      plan: payment.plan,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
    }));
  }
}
