import { Worker, Job } from "bullmq";
import { bullmqConnection } from "../../config/redis";
import logger from "../../config/logger";
import { sendEmail } from "../../utils/mail";
import type {
  EmailJobData,
  OtpEmailJobData,
  PaymentSuccessJobData,
  SubscriptionExpiringJobData,
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
 * Generate subscription expiring reminder email content
 */
function generateSubscriptionExpiringContent(
  data: SubscriptionExpiringJobData
) {
  const expiryDate = new Date(data.expiresAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    body: {
      name: data.userName,
      intro: [
        `Your ${data.plan.replace("_", " ")} subscription is expiring soon!`,
        `You have ${data.daysRemaining} days remaining until your subscription ends.`,
      ],
      table: {
        data: [
          { Item: "Current Plan", Details: data.plan.replace("_", " ") },
          { Item: "Expires On", Details: expiryDate },
          { Item: "Days Remaining", Details: `${data.daysRemaining} days` },
        ],
      },
      action: {
        instructions:
          "To continue enjoying PRO features without interruption, please renew your subscription:",
        button: {
          color: "#22BC66",
          text: "Renew Now",
          link: "https://yourapp.com/subscription", // Replace with actual URL
        },
      },
      outro: [
        "If you don't renew, your account will be downgraded to the free plan.",
        "Thank you for being a valued subscriber!",
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
    case "SUBSCRIPTION_EXPIRING":
      mailgenContent = generateSubscriptionExpiringContent(data);
      break;
    default: {
      const _exhaustiveCheck: never = data;
      throw new Error(
        `Unknown email type: ${(_exhaustiveCheck as EmailJobData).type}`
      );
    }
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
