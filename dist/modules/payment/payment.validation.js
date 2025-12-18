"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentSchema = exports.createOrderSchema = exports.currencySchema = void 0;
const zod_1 = require("zod");
const client_1 = require("../../generated/prisma/client");
exports.currencySchema = zod_1.z.enum(["INR", "USD"]);
const subscriptionPlanValues = Object.values(client_1.SubscriptionPlan);
exports.createOrderSchema = zod_1.z.object({
    plan: zod_1.z.enum(subscriptionPlanValues),
    currency: exports.currencySchema.default("INR"),
});
exports.verifyPaymentSchema = zod_1.z.object({
    razorpayOrderId: zod_1.z.string().min(1, "Order ID is required"),
    razorpayPaymentId: zod_1.z.string().min(1, "Payment ID is required"),
    razorpaySignature: zod_1.z.string().min(1, "Signature is required"),
});
