"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayProvider = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const nanoid_1 = require("nanoid");
const payment_config_1 = require("../../../config/payment.config");
const logger_1 = __importDefault(require("../../../config/logger"));
class RazorpayProvider {
    constructor() {
        this.razorpay = new razorpay_1.default({
            key_id: payment_config_1.paymentConfig.razorpay.keyId,
            key_secret: payment_config_1.paymentConfig.razorpay.keySecret,
        });
    }
    async createOrder(input) {
        const receipt = `rcpt_${(0, nanoid_1.nanoid)()}`;
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
                        keyId: payment_config_1.paymentConfig.razorpay.keyId,
                        orderId: order.id,
                        amount: Number(order.amount),
                        currency: order.currency,
                    },
                },
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Unknown Razorpay error";
            logger_1.default.error("Razorpay order creation failed", { error: message });
            return { success: false, error: message };
        }
    }
    async verifyPayment(input) {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = input;
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return { success: false, error: "Missing required payment fields" };
        }
        try {
            const body = `${razorpayOrderId}|${razorpayPaymentId}`;
            const expectedSignature = node_crypto_1.default
                .createHmac("sha256", payment_config_1.paymentConfig.razorpay.keySecret)
                .update(body)
                .digest("hex");
            if (expectedSignature.length !== razorpaySignature.length) {
                return { success: false, error: "Invalid payment signature" };
            }
            const isValid = node_crypto_1.default.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpaySignature));
            if (!isValid) {
                return { success: false, error: "Invalid payment signature" };
            }
            return { success: true };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Signature verification error";
            logger_1.default.error("Payment verification failed", { error: message });
            return { success: false, error: "Payment verification failed" };
        }
    }
    async handleWebhook(payload) {
        const { rawBody, signature } = payload;
        try {
            const expectedSignature = node_crypto_1.default
                .createHmac("sha256", payment_config_1.paymentConfig.razorpay.webhookSecret)
                .update(rawBody)
                .digest("hex");
            if (expectedSignature.length !== signature.length) {
                return {
                    success: false,
                    event: "unknown",
                    error: "Invalid webhook signature",
                };
            }
            const isValid = node_crypto_1.default.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
            if (!isValid) {
                return {
                    success: false,
                    event: "unknown",
                    error: "Invalid webhook signature",
                };
            }
            const event = JSON.parse(rawBody.toString());
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
                    return { success: true, event: event.event };
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Webhook processing error";
            logger_1.default.error("Webhook processing failed", { error: message });
            return {
                success: false,
                event: "unknown",
                error: "Webhook processing failed",
            };
        }
    }
}
exports.RazorpayProvider = RazorpayProvider;
