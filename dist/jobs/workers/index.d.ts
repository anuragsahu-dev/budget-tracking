import { emailWorker } from "./email.worker";
import { schedulerWorker } from "./scheduler.worker";
export declare function initializeWorkers(): Promise<void>;
export declare function shutdownWorkers(): Promise<void>;
export { emailWorker, schedulerWorker };
