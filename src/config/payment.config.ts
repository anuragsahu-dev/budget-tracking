import { config } from "./config";

// ==================== RAZORPAY CONFIGURATION ====================

export const paymentConfig = {
  razorpay: {
    keyId: config.razorpay.keyId,
    keySecret: config.razorpay.keySecret,
    webhookSecret: config.razorpay.webhookSecret,
  },
} as const;
