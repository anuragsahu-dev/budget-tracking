import { Worker, Job } from "bullmq";
import { bullmqConnection } from "../../config/redis";
import logger from "../../config/logger";
import { sendEmail } from "../../utils/mail";
import type {
  EmailJobData,
  OtpEmailJobData,
  PaymentSuccessJobData,
} from "../types";

const QUEUE_NAME = "email";

/**
 * Generate OTP email content
 */
function generateOtpEmailContent(data: OtpEmailJobData) {
  return {
    body: {
      name: data.userName || "User",
      intro: [
        "You requested a one-time password (OTP) to verify your account.",
        "This OTP is valid for 5 minutes.",
      ],
      table: {
        data: [
          {
            "Your OTP Code": data.otp,
          },
        ],
        columns: {
          customWidth: {
            "Your OTP Code": "100%",
          },
          customAlignment: {
            "Your OTP Code": "center",
          },
        },
      },
      outro: [
        "If you did not request this OTP, you can safely ignore this email.",
        "Do not share this code with anyone.",
      ],
    },
  };
}

/**
 * Generate payment success email content
 */
function generatePaymentSuccessContent(data: PaymentSuccessJobData) {
  const currencySymbol = data.currency === "INR" ? "₹" : "$";
  const expiryDate = new Date(data.expiresAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    body: {
      name: data.userName,
      intro: [
        `Your payment of ${currencySymbol}${data.amount.toFixed(
          2
        )} was successful!`,
        `Your ${data.plan.replace("_", " ")} subscription is now active.`,
      ],
      table: {
        data: [
          { Item: "Transaction ID", Details: data.transactionId },
          {
            Item: "Amount Paid",
            Details: `${currencySymbol}${data.amount.toFixed(2)}`,
          },
          { Item: "Plan", Details: data.plan.replace("_", " ") },
          { Item: "Valid Until", Details: expiryDate },
          { Item: "Status", Details: "Active ✓" },
        ],
      },
      outro: [
        "Thank you for subscribing! You now have access to all PRO features.",
        "If you have any questions, feel free to contact our support team.",
      ],
    },
  };
}

/**
 * Process email job based on type
 */
async function processEmailJob(job: Job<EmailJobData>): Promise<void> {
  const data = job.data;

  logger.info(`Processing email job`, {
    jobId: job.id,
    type: data.type,
    to: data.to,
  });

  let mailgenContent;

  switch (data.type) {
    case "OTP":
      mailgenContent = generateOtpEmailContent(data);
      break;
    case "PAYMENT_SUCCESS":
      mailgenContent = generatePaymentSuccessContent(data);
      break;
    default:
      throw new Error(`Unknown email type: ${(data as EmailJobData).type}`);
  }

  await sendEmail({
    email: data.to,
    subject: data.subject,
    mailgenContent,
  });

  logger.info(`Email sent successfully`, {
    jobId: job.id,
    type: data.type,
    to: data.to,
  });
}

/**
 * Email worker that processes email jobs from the queue
 */
export const emailWorker = new Worker<EmailJobData>(
  QUEUE_NAME,
  processEmailJob,
  {
    connection: bullmqConnection,
    concurrency: 5,
  }
);

// Worker event handlers
emailWorker.on("completed", (job) => {
  logger.info(`Email job completed`, { jobId: job.id, type: job.data.type });
});

emailWorker.on("failed", (job, error) => {
  logger.error(`Email job failed`, {
    jobId: job?.id,
    type: job?.data.type,
    error: error.message,
    attempts: job?.attemptsMade,
  });
});

emailWorker.on("error", (error) => {
  logger.error("Email worker error", { error: error.message });
});
