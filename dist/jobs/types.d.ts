export type EmailJobType = "OTP" | "PAYMENT_SUCCESS";
interface BaseEmailJobData {
    type: EmailJobType;
    to: string;
    subject: string;
}
export interface OtpEmailJobData extends BaseEmailJobData {
    type: "OTP";
    otp: string;
    userName?: string;
}
export interface PaymentSuccessJobData extends BaseEmailJobData {
    type: "PAYMENT_SUCCESS";
    userName: string;
    amount: number;
    currency: string;
    transactionId: string;
}
export type EmailJobData = OtpEmailJobData | PaymentSuccessJobData;
export {};
