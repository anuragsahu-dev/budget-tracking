import type { SubscriptionPlan } from "../generated/prisma/client";
import type { Currency, PlanPricing } from "../types/payment.types";
import { config } from "./config";

// ==================== RAZORPAY CONFIGURATION ====================

export const paymentConfig = {
  razorpay: {
    keyId: config.razorpay.keyId,
    keySecret: config.razorpay.keySecret,
    webhookSecret: config.razorpay.webhookSecret,
  },
} as const;

type PlanPricingByCurrency = Record<Currency, PlanPricing>;

export const planPricing: Record<SubscriptionPlan, PlanPricingByCurrency> = {
  PRO_MONTHLY: {
    INR: {
      amount: 49900, // ₹499 in paise
      currency: "INR",
      durationDays: 30,
    },
    USD: {
      amount: 999, // $9.99 in cents (for future Stripe)
      currency: "USD",
      durationDays: 30,
    },
  },
  PRO_YEARLY: {
    INR: {
      amount: 499900, // ₹4999 in paise
      currency: "INR",
      durationDays: 365,
    },
    USD: {
      amount: 9999, // $99.99 in cents (for future Stripe)
      currency: "USD",
      durationDays: 365,
    },
  },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get pricing for a plan in a specific currency
 */
export function getPlanPricing(
  plan: SubscriptionPlan,
  currency: Currency
): PlanPricing {
  return planPricing[plan][currency];
}

/**
 * Check if Razorpay is configured
 */
export function isRazorpayConfigured(): boolean {
  return !!(paymentConfig.razorpay.keyId && paymentConfig.razorpay.keySecret);
}
