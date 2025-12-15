// Payment Infrastructure Exports

// Factory - Use this to get the payment provider
export { getPaymentProvider } from "./payment.factory";

// Provider - Direct access if needed
export { RazorpayProvider } from "./providers/razorpay.provider";

// Types
export type {
  IPaymentProvider,
  CreateOrderResult,
  VerifyPaymentInput,
  VerifyPaymentResult,
  WebhookPayload,
  WebhookResult,
  Currency,
} from "./payment.interface";
