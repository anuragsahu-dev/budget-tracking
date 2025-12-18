"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentProvider = getPaymentProvider;
const payment_config_1 = require("../../config/payment.config");
const razorpay_provider_1 = require("./providers/razorpay.provider");
let razorpayInstance = null;
function getPaymentProvider() {
    const { keyId, keySecret } = payment_config_1.paymentConfig.razorpay;
    if (!keyId || !keySecret) {
        throw new Error("Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.");
    }
    if (!razorpayInstance) {
        razorpayInstance = new razorpay_provider_1.RazorpayProvider();
    }
    return razorpayInstance;
}
