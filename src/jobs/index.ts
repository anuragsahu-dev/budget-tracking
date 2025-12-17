/**
 * Jobs Module
 * Background job processing with BullMQ
 */

// Types
export type {
  EmailJobData,
  EmailJobType,
  OtpEmailJobData,
  PaymentSuccessJobData,
} from "./types";

// Email Queues
export {
  emailQueue,
  addEmailJob,
  queueOtpEmail,
  queuePaymentSuccessEmail,
} from "./queues";

// Scheduler Queues
export {
  schedulerQueue,
  setupScheduledJobs,
  getScheduledJobsStatus,
} from "./queues";

// Workers
export {
  initializeWorkers,
  shutdownWorkers,
  emailWorker,
  schedulerWorker,
} from "./workers";
