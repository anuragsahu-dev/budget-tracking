"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const payment_service_1 = require("./payment.service");
const apiResponse_1 = require("../../utils/apiResponse");
const express_1 = require("../../types/express");
const payment_1 = require("../../infrastructure/payment");
const logger_1 = __importDefault(require("../../config/logger"));
exports.PaymentController = {
    getAvailablePlans: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { currency = "INR" } = req.query;
        const plans = await payment_service_1.PaymentService.getAvailablePlans(currency);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Available plans fetched", plans);
    }),
    createOrder: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const input = (0, express_1.getValidatedBody)(req);
        const order = await payment_service_1.PaymentService.createOrder(userId, input);
        return (0, apiResponse_1.sendApiResponse)(res, 201, "Order created successfully", order);
    }),
    verifyPayment: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const input = (0, express_1.getValidatedBody)(req);
        const result = await payment_service_1.PaymentService.verifyPayment(userId, input);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Payment verified successfully", result);
    }),
    getPaymentHistory: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const payments = await payment_service_1.PaymentService.getPaymentHistory(userId);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Payment history fetched", payments);
    }),
    handleWebhook: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const signature = req.headers["x-razorpay-signature"];
        logger_1.default.info("Webhook received", {
            hasSignature: !!signature,
            contentType: req.headers["content-type"],
        });
        if (!signature) {
            logger_1.default.warn("Webhook received without signature - rejecting");
            return (0, apiResponse_1.sendApiResponse)(res, 400, "Missing signature");
        }
        const provider = (0, payment_1.getPaymentProvider)();
        const result = await provider.handleWebhook({
            rawBody: req.rawBody || JSON.stringify(req.body),
            signature,
        });
        if (!result.success) {
            logger_1.default.warn("Webhook signature verification failed", {
                error: result.error,
                event: result.event,
            });
            return (0, apiResponse_1.sendApiResponse)(res, 400, "Invalid webhook");
        }
        const { paymentId, orderId, status, event } = result;
        logger_1.default.info("Webhook verified", { event, paymentId, orderId, status });
        if (paymentId && orderId && status) {
            try {
                switch (status) {
                    case "completed":
                        await payment_service_1.PaymentService.handlePaymentCaptured(paymentId, orderId);
                        break;
                    case "failed": {
                        const errorDesc = req.body.payload?.payment?.entity?.error_description;
                        await payment_service_1.PaymentService.handlePaymentFailed(paymentId, orderId, errorDesc);
                        break;
                    }
                    case "refunded":
                        logger_1.default.info("Webhook: Refund event received", {
                            paymentId,
                            note: "Admin should manually cancel subscription if needed",
                        });
                        break;
                }
            }
            catch (error) {
                logger_1.default.error("Webhook processing error", {
                    event,
                    paymentId,
                    orderId,
                    error: error instanceof Error ? error.message : "Unknown error",
                    stack: error instanceof Error ? error.stack : undefined,
                    action: "Webhook acknowledged but processing failed - manual review needed",
                });
            }
        }
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Webhook processed");
    }),
};
