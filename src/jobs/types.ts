/**
 * Email job types
 */
export type EmailJobType = "OTP" | "PAYMENT_SUCCESS";

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
 * Payment success job data (for future use)
 */
export interface PaymentSuccessJobData extends BaseEmailJobData {
  type: "PAYMENT_SUCCESS";
  userName: string;
  amount: number;
  currency: string;
  transactionId: string;
}

/**
 * Union type of all email job data
 */
export type EmailJobData = OtpEmailJobData | PaymentSuccessJobData;
