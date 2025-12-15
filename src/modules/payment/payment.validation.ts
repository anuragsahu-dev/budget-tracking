import { z } from "zod";
import { SubscriptionPlan } from "../../generated/prisma/client";

// Currency type
export const currencySchema = z.enum(["INR", "USD"]);
export type CurrencyInput = z.infer<typeof currencySchema>;

// Subscription plan values - typed for Zod v4 compatibility
const subscriptionPlanValues = Object.values(SubscriptionPlan) as [
  SubscriptionPlan,
  ...SubscriptionPlan[]
];

// Create order (initiate payment)
export const createOrderSchema = z.object({
  plan: z.enum(subscriptionPlanValues),
  currency: currencySchema.default("INR"),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// Verify payment (after Razorpay callback)
export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1, "Order ID is required"),
  razorpayPaymentId: z.string().min(1, "Payment ID is required"),
  razorpaySignature: z.string().min(1, "Signature is required"),
});
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
