"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const payment_repository_1 = require("./payment.repository");
const subscription_repository_1 = require("../subscription/subscription.repository");
const planPricing_repository_1 = require("../admin/planPricing.repository");
const payment_1 = require("../../infrastructure/payment");
const error_middleware_1 = require("../../middlewares/error.middleware");
const logger_1 = __importDefault(require("../../config/logger"));
const client_1 = require("../../generated/prisma/client");
class PaymentService {
    static async createOrder(userId, input) {
        const { plan, currency } = input;
        const pricing = await planPricing_repository_1.PlanPricingRepository.findByPlanAndCurrency(plan, currency);
        if (!pricing) {
            throw new error_middleware_1.ApiError(400, `Pricing not available for ${plan} in ${currency}`);
        }
        if (!pricing.isActive) {
            throw new error_middleware_1.ApiError(400, "This plan is currently not available");
        }
        const provider = (0, payment_1.getPaymentProvider)();
        const orderResult = await provider.createOrder({
            amount: pricing.amount,
            currency: currency,
            userId,
            plan,
        });
        if (!orderResult.success) {
            logger_1.default.error("Razorpay order creation failed", {
                userId,
                plan,
                currency,
                error: orderResult.error,
            });
            throw new error_middleware_1.ApiError(500, orderResult.error);
        }
        const paymentResult = await payment_repository_1.PaymentRepository.createPayment({
            userId,
            plan,
            provider: client_1.PaymentProvider.RAZORPAY,
            amount: pricing.amount / 100,
            currency,
            providerOrderId: orderResult.data.orderId,
            status: client_1.PaymentStatus.PENDING,
        });
        if (!paymentResult.success) {
            logger_1.default.error("Failed to create payment record", {
                userId,
                plan,
                orderId: orderResult.data.orderId,
                error: paymentResult.message,
            });
            throw new error_middleware_1.ApiError(paymentResult.statusCode, paymentResult.message);
        }
        logger_1.default.info("Payment order created", {
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
    static async verifyPayment(userId, input) {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = input;
        const payment = await payment_repository_1.PaymentRepository.findByProviderOrderId(razorpayOrderId);
        if (!payment) {
            logger_1.default.warn("Payment verification attempted for unknown order", {
                userId,
                orderId: razorpayOrderId,
            });
            throw new error_middleware_1.ApiError(404, "Payment not found");
        }
        if (payment.userId !== userId) {
            logger_1.default.warn("Payment verification attempted by wrong user", {
                paymentUserId: payment.userId,
                requestUserId: userId,
                orderId: razorpayOrderId,
            });
            throw new error_middleware_1.ApiError(403, "Payment does not belong to this user");
        }
        if (payment.status === client_1.PaymentStatus.COMPLETED) {
            logger_1.default.info("Payment already completed, returning existing subscription", {
                userId,
                orderId: razorpayOrderId,
            });
            const subscription = await subscription_repository_1.SubscriptionRepository.findByUserId(userId);
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
        if (payment.status !== client_1.PaymentStatus.PENDING) {
            throw new error_middleware_1.ApiError(400, "Payment already processed");
        }
        const provider = (0, payment_1.getPaymentProvider)();
        const verifyResult = await provider.verifyPayment({
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
        });
        if (!verifyResult.success) {
            await payment_repository_1.PaymentRepository.updatePaymentStatus(payment.id, client_1.PaymentStatus.FAILED, { failureReason: verifyResult.error });
            logger_1.default.warn("Payment signature verification failed", {
                userId,
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
                error: verifyResult.error,
            });
            throw new error_middleware_1.ApiError(400, "Payment verification failed");
        }
        logger_1.default.info("Payment signature verified, processing subscription", {
            userId,
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
        return this.processCompletedPayment(payment.id, razorpayOrderId, razorpayPaymentId, userId, payment.plan, payment.currency);
    }
    static async processCompletedPayment(paymentId, razorpayOrderId, razorpayPaymentId, userId, plan, currency) {
        const existingSubscription = await subscription_repository_1.SubscriptionRepository.findByUserId(userId);
        if (existingSubscription &&
            existingSubscription.status === client_1.SubscriptionStatus.ACTIVE &&
            existingSubscription.plan === plan) {
            logger_1.default.info("Subscription already active, updating payment record only", {
                userId,
                orderId: razorpayOrderId,
                subscriptionId: existingSubscription.id,
            });
            await payment_repository_1.PaymentRepository.updateByProviderOrderId(razorpayOrderId, {
                status: client_1.PaymentStatus.COMPLETED,
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
        const completedPayment = await payment_repository_1.PaymentRepository.updateByProviderOrderId(razorpayOrderId, {
            status: client_1.PaymentStatus.COMPLETED,
            providerPaymentId: razorpayPaymentId,
            paidAt: new Date(),
        });
        if (!completedPayment.success) {
            logger_1.default.error("CRITICAL: Failed to mark payment as completed", {
                severity: "CRITICAL",
                paymentId,
                orderId: razorpayOrderId,
                razorpayPaymentId,
                userId,
                error: completedPayment.message,
                action: "REQUIRES_MANUAL_INTERVENTION",
                resolution: "Check payment status in Razorpay dashboard and update database",
            });
        }
        const pricing = await planPricing_repository_1.PlanPricingRepository.findByPlanAndCurrency(plan, currency);
        const durationDays = pricing?.durationDays ??
            (plan === client_1.SubscriptionPlan.PRO_YEARLY ? 365 : 30);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + durationDays);
        const subscriptionResult = await subscription_repository_1.SubscriptionRepository.activateSubscription(userId, plan, expiresAt);
        if (!subscriptionResult.success) {
            logger_1.default.error("CRITICAL: Subscription activation failed after payment", {
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
            return {
                success: true,
                pending: true,
                message: "Payment received successfully. Your subscription is being activated. " +
                    "If you don't see it within a few minutes, please contact support.",
                paymentId: razorpayPaymentId,
            };
        }
        const linkResult = await payment_repository_1.PaymentRepository.updateByProviderOrderId(razorpayOrderId, {
            status: client_1.PaymentStatus.COMPLETED,
            providerPaymentId: razorpayPaymentId,
            paidAt: new Date(),
            subscriptionId: subscriptionResult.data.id,
        });
        if (!linkResult.success) {
            logger_1.default.warn("Failed to link subscription to payment record", {
                paymentId,
                orderId: razorpayOrderId,
                subscriptionId: subscriptionResult.data.id,
                error: linkResult.message,
                note: "User has access - this is a data consistency issue only",
            });
        }
        logger_1.default.info("Payment verified and subscription activated successfully", {
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
    static async handlePaymentCaptured(razorpayPaymentId, razorpayOrderId) {
        logger_1.default.info("Webhook: Processing payment.captured event", {
            razorpayPaymentId,
            razorpayOrderId,
        });
        const payment = await payment_repository_1.PaymentRepository.findByProviderOrderId(razorpayOrderId);
        if (!payment) {
            logger_1.default.warn("Webhook: Payment record not found in database", {
                razorpayOrderId,
                razorpayPaymentId,
                action: "Ignoring webhook - order may be from different system or test",
            });
            return { processed: false, reason: "Payment not found" };
        }
        if (payment.status === client_1.PaymentStatus.COMPLETED) {
            logger_1.default.info("Webhook: Payment already completed, nothing to do", {
                razorpayOrderId,
                paymentId: payment.id,
            });
            return { processed: true, reason: "Already completed" };
        }
        if (payment.status === client_1.PaymentStatus.FAILED) {
            logger_1.default.warn("Webhook: payment.captured received for FAILED payment", {
                razorpayOrderId,
                paymentId: payment.id,
                note: "This is unusual - payment may have been marked failed prematurely",
            });
        }
        logger_1.default.info("Webhook: Activating subscription via webhook backup", {
            razorpayOrderId,
            razorpayPaymentId,
            userId: payment.userId,
            plan: payment.plan,
        });
        await this.processCompletedPayment(payment.id, razorpayOrderId, razorpayPaymentId, payment.userId, payment.plan, payment.currency);
        return { processed: true };
    }
    static async handlePaymentFailed(razorpayPaymentId, razorpayOrderId, errorDescription) {
        logger_1.default.info("Webhook: Processing payment.failed event", {
            razorpayPaymentId,
            razorpayOrderId,
            errorDescription,
        });
        const payment = await payment_repository_1.PaymentRepository.findByProviderOrderId(razorpayOrderId);
        if (!payment) {
            logger_1.default.warn("Webhook: Payment not found for failure event", {
                razorpayOrderId,
            });
            return { processed: false, reason: "Payment not found" };
        }
        if (payment.status === client_1.PaymentStatus.COMPLETED) {
            logger_1.default.warn("Webhook: Ignoring payment.failed for COMPLETED payment", {
                razorpayOrderId,
                paymentId: payment.id,
                note: "Payment was already completed - this event may be delayed",
            });
            return { processed: true, reason: "Already completed" };
        }
        if (payment.status !== client_1.PaymentStatus.PENDING) {
            return { processed: true, reason: "Already processed" };
        }
        await payment_repository_1.PaymentRepository.updatePaymentStatus(payment.id, client_1.PaymentStatus.FAILED, { failureReason: errorDescription || "Payment failed via webhook" });
        logger_1.default.info("Webhook: Payment marked as failed", {
            paymentId: payment.id,
            razorpayOrderId,
            errorDescription,
        });
        return { processed: true };
    }
    static async getAvailablePlans(currency) {
        const allPricing = await planPricing_repository_1.PlanPricingRepository.findAllActive();
        const plans = allPricing.filter((p) => p.currency === currency);
        return plans.map((p) => ({
            plan: p.plan,
            name: p.name,
            description: p.description,
            amount: p.amount,
            currency: p.currency,
            durationDays: p.durationDays,
            displayPrice: currency === "INR"
                ? `₹${(p.amount / 100).toFixed(2)}`
                : `$${(p.amount / 100).toFixed(2)}`,
        }));
    }
    static async getPaymentHistory(userId) {
        const payments = await payment_repository_1.PaymentRepository.findByUserId(userId);
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
exports.PaymentService = PaymentService;
