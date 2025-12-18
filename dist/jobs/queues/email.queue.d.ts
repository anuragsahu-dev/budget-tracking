import { Queue } from "bullmq";
import type { EmailJobData } from "../types";
export declare const emailQueue: Queue<EmailJobData, any, string, EmailJobData, any, string>;
export declare function addEmailJob(data: EmailJobData): Promise<void>;
export declare function queueOtpEmail(email: string, otp: string, userName?: string): Promise<void>;
export declare function queuePaymentSuccessEmail(email: string, userName: string, amount: number, currency: string, transactionId: string): Promise<void>;
