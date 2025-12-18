import { Queue } from "bullmq";
export declare const schedulerQueue: Queue<any, any, string, any, any, string>;
export type ScheduledJobType = "expire-subscriptions" | "cleanup-expired-otps" | "cleanup-old-sessions";
export declare function setupScheduledJobs(): Promise<void>;
export declare function getScheduledJobsStatus(): Promise<{
    repeatable: {
        name: string;
        every: string | null | undefined;
        next: string | null;
    }[];
    counts: {
        waiting: number;
        active: number;
        failed: number;
    };
}>;
