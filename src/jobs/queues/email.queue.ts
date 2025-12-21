import { Queue } from "bullmq";
import { bullmqConnection } from "../../config/redis";
import type { EmailJobData } from "../types";
import logger from "../../config/logger";

const QUEUE_NAME = "email";

/**
 * Email queue for processing background email jobs
 */
export const emailQueue = new Queue<EmailJobData>(QUEUE_NAME, {
  connection: bullmqConnection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});

/**
 * Add an email job to the queue
 */
export async function addEmailJob(data: EmailJobData): Promise<void> {
  try {
    await emailQueue.add(data.type, data, {
      priority: data.type === "OTP" ? 1 : 2, // OTP emails have highest priority
    });
    logger.info(`Email job added to queue`, { type: data.type, to: data.to });
  } catch (error) {
    logger.error("Failed to add email job to queue", { error, data });
    throw error;
  }
}

/**
 * Add OTP email job to queue
 */
export async function queueOtpEmail(
  email: string,
  otp: string,
  userName?: string
): Promise<void> {
  await addEmailJob({
    type: "OTP",
    to: email,
    subject: "Your OTP Code",
    otp,
    userName,
  });
}

/**
 * Add payment success email job to queue
 */
export async function queuePaymentSuccessEmail(
  email: string,
  userName: string,
  amount: number,
  currency: string,
  transactionId: string,
  plan: string,
  expiresAt: Date
): Promise<void> {
  await addEmailJob({
    type: "PAYMENT_SUCCESS",
    to: email,
    subject: "Payment Successful - Your Subscription is Active",
    userName,
    amount,
    currency,
    transactionId,
    plan,
    expiresAt: expiresAt.toISOString(),
  });
}
