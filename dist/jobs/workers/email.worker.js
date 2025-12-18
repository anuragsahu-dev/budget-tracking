"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const logger_1 = __importDefault(require("../../config/logger"));
const mail_1 = require("../../utils/mail");
const QUEUE_NAME = "email";
function generateOtpEmailContent(data) {
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
function generatePaymentSuccessContent(data) {
    return {
        body: {
            name: data.userName,
            intro: `Your payment of ${data.currency} ${data.amount.toFixed(2)} was successful!`,
            table: {
                data: [
                    { key: "Transaction ID", value: data.transactionId },
                    {
                        key: "Amount",
                        value: `${data.currency} ${data.amount.toFixed(2)}`,
                    },
                    { key: "Status", value: "Completed" },
                ],
            },
            outro: "Thank you for your purchase!",
        },
    };
}
async function processEmailJob(job) {
    const data = job.data;
    logger_1.default.info(`Processing email job`, {
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
            throw new Error(`Unknown email type: ${data.type}`);
    }
    await (0, mail_1.sendEmail)({
        email: data.to,
        subject: data.subject,
        mailgenContent,
    });
    logger_1.default.info(`Email sent successfully`, {
        jobId: job.id,
        type: data.type,
        to: data.to,
    });
}
exports.emailWorker = new bullmq_1.Worker(QUEUE_NAME, processEmailJob, {
    connection: redis_1.bullmqConnection,
    concurrency: 5,
});
exports.emailWorker.on("completed", (job) => {
    logger_1.default.info(`Email job completed`, { jobId: job.id, type: job.data.type });
});
exports.emailWorker.on("failed", (job, error) => {
    logger_1.default.error(`Email job failed`, {
        jobId: job?.id,
        type: job?.data.type,
        error: error.message,
        attempts: job?.attemptsMade,
    });
});
exports.emailWorker.on("error", (error) => {
    logger_1.default.error("Email worker error", { error: error.message });
});
