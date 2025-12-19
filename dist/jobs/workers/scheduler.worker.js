"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulerWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const logger_1 = __importDefault(require("../../config/logger"));
const subscription_repository_1 = require("../../modules/subscription/subscription.repository");
const prisma_1 = __importDefault(require("../../config/prisma"));
const QUEUE_NAME = "scheduler";
exports.schedulerWorker = new bullmq_1.Worker(QUEUE_NAME, async (job) => {
    const jobType = job.name;
    const startTime = Date.now();
    logger_1.default.info(`Scheduled job started: ${jobType}`, { jobId: job.id });
    try {
        switch (jobType) {
            case "expire-subscriptions":
                await handleExpireSubscriptions();
                break;
            case "cleanup-expired-otps":
                await handleCleanupExpiredOtps();
                break;
            case "cleanup-old-sessions":
                await handleCleanupOldSessions();
                break;
            default:
                logger_1.default.warn(`Unknown scheduled job type: ${jobType}`);
        }
        const duration = Date.now() - startTime;
        logger_1.default.info(`Scheduled job completed: ${jobType}`, {
            jobId: job.id,
            durationMs: duration,
        });
    }
    catch (error) {
        logger_1.default.error(`Scheduled job failed: ${jobType}`, {
            jobId: job.id,
            error: error instanceof Error ? error.message : error,
        });
        throw error;
    }
}, {
    connection: redis_1.bullmqConnection,
    concurrency: 1,
});
async function handleExpireSubscriptions() {
    const count = await subscription_repository_1.SubscriptionRepository.markExpiredSubscriptions();
    if (count > 0) {
        logger_1.default.info(`Marked ${count} subscriptions as expired`);
    }
    else {
        logger_1.default.debug("No subscriptions to expire");
    }
}
async function handleCleanupExpiredOtps() {
    const result = await prisma_1.default.otp.deleteMany({
        where: {
            expiresAt: { lt: new Date() },
        },
    });
    if (result.count > 0) {
        logger_1.default.info(`Deleted ${result.count} expired OTP records`);
    }
}
async function handleCleanupOldSessions() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const result = await prisma_1.default.session.deleteMany({
        where: {
            updatedAt: { lt: thirtyDaysAgo },
        },
    });
    if (result.count > 0) {
        logger_1.default.info(`Deleted ${result.count} old session records`);
    }
}
exports.schedulerWorker.on("completed", (job) => {
    logger_1.default.debug(`Scheduler job completed`, { jobId: job?.id, name: job?.name });
});
exports.schedulerWorker.on("failed", (job, error) => {
    logger_1.default.error(`Scheduler job failed`, {
        jobId: job?.id,
        name: job?.name,
        error: error.message,
        attempts: job?.attemptsMade,
    });
});
exports.schedulerWorker.on("error", (error) => {
    logger_1.default.error("Scheduler worker error", { error: error.message });
});
