"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulerWorker = exports.emailWorker = void 0;
exports.initializeWorkers = initializeWorkers;
exports.shutdownWorkers = shutdownWorkers;
const logger_1 = __importDefault(require("../../config/logger"));
const email_worker_1 = require("./email.worker");
Object.defineProperty(exports, "emailWorker", { enumerable: true, get: function () { return email_worker_1.emailWorker; } });
const scheduler_worker_1 = require("./scheduler.worker");
Object.defineProperty(exports, "schedulerWorker", { enumerable: true, get: function () { return scheduler_worker_1.schedulerWorker; } });
const scheduler_queue_1 = require("../queues/scheduler.queue");
async function initializeWorkers() {
    logger_1.default.info("Initializing background workers...");
    await (0, scheduler_queue_1.setupScheduledJobs)();
    logger_1.default.info("Background workers initialized", {
        workers: ["email", "scheduler"],
    });
}
async function shutdownWorkers() {
    logger_1.default.info("Shutting down background workers...");
    await Promise.all([email_worker_1.emailWorker.close(), scheduler_worker_1.schedulerWorker.close()]);
    logger_1.default.info("Background workers shut down successfully");
}
