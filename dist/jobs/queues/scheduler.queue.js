"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulerQueue = void 0;
exports.setupScheduledJobs = setupScheduledJobs;
exports.getScheduledJobsStatus = getScheduledJobsStatus;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const logger_1 = __importDefault(require("../../config/logger"));
const QUEUE_NAME = "scheduler";
exports.schedulerQueue = new bullmq_1.Queue(QUEUE_NAME, {
    connection: redis_1.bullmqConnection,
    defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
    },
});
async function setupScheduledJobs() {
    try {
        const existingJobs = await exports.schedulerQueue.getRepeatableJobs();
        for (const job of existingJobs) {
            await exports.schedulerQueue.removeRepeatableByKey(job.key);
        }
        await exports.schedulerQueue.add("expire-subscriptions", { description: "Mark expired subscriptions" }, {
            repeat: {
                every: 60 * 60 * 1000,
            },
            jobId: "expire-subscriptions",
        });
        await exports.schedulerQueue.add("cleanup-expired-otps", { description: "Delete expired OTP records" }, {
            repeat: {
                every: 6 * 60 * 60 * 1000,
            },
            jobId: "cleanup-expired-otps",
        });
        await exports.schedulerQueue.add("cleanup-old-sessions", { description: "Delete old session records" }, {
            repeat: {
                every: 24 * 60 * 60 * 1000,
            },
            jobId: "cleanup-old-sessions",
        });
        const jobs = await exports.schedulerQueue.getRepeatableJobs();
        logger_1.default.info("Scheduled jobs configured", {
            jobs: jobs.map((j) => ({ name: j.name, every: j.every })),
        });
    }
    catch (error) {
        logger_1.default.error("Failed to setup scheduled jobs", { error });
        throw error;
    }
}
async function getScheduledJobsStatus() {
    const repeatableJobs = await exports.schedulerQueue.getRepeatableJobs();
    const waiting = await exports.schedulerQueue.getWaiting();
    const active = await exports.schedulerQueue.getActive();
    const failed = await exports.schedulerQueue.getFailed();
    return {
        repeatable: repeatableJobs.map((j) => ({
            name: j.name,
            every: j.every,
            next: j.next ? new Date(j.next).toISOString() : null,
        })),
        counts: {
            waiting: waiting.length,
            active: active.length,
            failed: failed.length,
        },
    };
}
