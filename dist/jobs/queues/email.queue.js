"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = void 0;
exports.addEmailJob = addEmailJob;
exports.queueOtpEmail = queueOtpEmail;
exports.queuePaymentSuccessEmail = queuePaymentSuccessEmail;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const logger_1 = __importDefault(require("../../config/logger"));
const QUEUE_NAME = "email";
exports.emailQueue = new bullmq_1.Queue(QUEUE_NAME, {
    connection: redis_1.bullmqConnection,
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
async function addEmailJob(data) {
    try {
        await exports.emailQueue.add(data.type, data, {
            priority: data.type === "OTP" ? 1 : 2,
        });
        logger_1.default.info(`Email job added to queue`, { type: data.type, to: data.to });
    }
    catch (error) {
        logger_1.default.error("Failed to add email job to queue", { error, data });
        throw error;
    }
}
async function queueOtpEmail(email, otp, userName) {
    await addEmailJob({
        type: "OTP",
        to: email,
        subject: "Your OTP Code",
        otp,
        userName,
    });
}
async function queuePaymentSuccessEmail(email, userName, amount, currency, transactionId) {
    await addEmailJob({
        type: "PAYMENT_SUCCESS",
        to: email,
        subject: "Payment Successful",
        userName,
        amount,
        currency,
        transactionId,
    });
}
