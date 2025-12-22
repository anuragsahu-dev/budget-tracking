/**
 * Email job types
 */
export type EmailJobType = "OTP" | "PAYMENT_SUCCESS" | "SUBSCRIPTION_EXPIRING";

/**
 * Base email job data
 */
interface BaseEmailJobData {
  type: EmailJobType;
  to: string;
  subject: string;
}

/**
 * OTP email job data
 */
export interface OtpEmailJobData extends BaseEmailJobData {
  type: "OTP";
  otp: string;
  userName?: string;
}

/**
 * Payment success job data
 */
export interface PaymentSuccessJobData extends BaseEmailJobData {
  type: "PAYMENT_SUCCESS";
  userName: string;
  amount: number;
  currency: string;
  transactionId: string;
  plan: string;
  expiresAt: string; // ISO date string
}

/**
 * Subscription expiring reminder job data
 */
export interface SubscriptionExpiringJobData extends BaseEmailJobData {
  type: "SUBSCRIPTION_EXPIRING";
  userName: string;
  plan: string;
  expiresAt: string; // ISO date string
  daysRemaining: number;
}

/**
 * Union type of all email job data
 */
export type EmailJobData =
  | OtpEmailJobData
  | PaymentSuccessJobData
  | SubscriptionExpiringJobData;
