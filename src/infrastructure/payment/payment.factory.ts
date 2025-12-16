import { paymentConfig } from "../../config/payment.config";
import type { IPaymentProvider } from "./payment.interface";
import { RazorpayProvider } from "./providers/razorpay.provider";

// Singleton instance (created once, reused)
let razorpayInstance: RazorpayProvider | null = null;

/**
 * Get the payment provider instance
 * Currently only Razorpay is supported
 *
 * Future: Add provider selection logic here based on currency
 * - INR → Razorpay
 * - USD → Stripe
 */
export function getPaymentProvider(): IPaymentProvider {
  const { keyId, keySecret } = paymentConfig.razorpay;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables."
    );
  }

  if (!razorpayInstance) {
    razorpayInstance = new RazorpayProvider();
  }

  return razorpayInstance;
}
