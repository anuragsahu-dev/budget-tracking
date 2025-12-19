import { Worker } from "bullmq";
import type { EmailJobData } from "../types";
export declare const emailWorker: Worker<EmailJobData, any, string>;
