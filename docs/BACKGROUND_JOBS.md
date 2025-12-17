# Background Jobs System Documentation

This document explains the BullMQ-based background job system used for email processing and scheduled tasks in the Budget Tracking application.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Queues](#queues)
5. [Workers](#workers)
6. [Scheduled Jobs](#scheduled-jobs)
7. [How It Works in Docker Swarm](#how-it-works-in-docker-swarm)
8. [Adding New Jobs](#adding-new-jobs)
9. [Monitoring & Debugging](#monitoring--debugging)

---

## Overview

The application uses **BullMQ** for background job processing. BullMQ provides:

- ✅ **Redis-backed queuing** - Jobs persist across restarts
- ✅ **Cluster-safe** - Only one worker processes each job (perfect for Docker Swarm)
- ✅ **Automatic retries** - Failed jobs are retried with exponential backoff
- ✅ **Repeatable jobs** - Cron-like scheduling for recurring tasks

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         APPLICATION                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │   Queues     │     │    Redis     │     │   Workers    │    │
│  │              │────▶│              │◀────│              │    │
│  │ • email      │     │  Job Store   │     │ • email      │    │
│  │ • scheduler  │     │              │     │ • scheduler  │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Flow:
1. Application adds job to Queue
2. Queue stores job in Redis
3. Worker picks up job from Redis
4. Worker processes job
5. Job marked as completed/failed
```

---

## File Structure

```
src/jobs/
├── index.ts                 # Main export file
├── types.ts                 # TypeScript types for job data
│
├── queues/
│   ├── index.ts            # Queue exports
│   ├── email.queue.ts      # Email queue + helper functions
│   └── scheduler.queue.ts  # Scheduled jobs queue
│
└── workers/
    ├── index.ts            # Worker initialization/shutdown
    ├── email.worker.ts     # Processes email jobs
    └── scheduler.worker.ts # Processes scheduled jobs
```

---

## Queues

### Email Queue (`email.queue.ts`)

Handles email sending jobs.

```typescript
// Add an OTP email to the queue
import { queueOtpEmail } from "./jobs";
await queueOtpEmail("user@example.com", "123456", "John");

// Add a payment success email
import { queuePaymentSuccessEmail } from "./jobs";
await queuePaymentSuccessEmail(
  "user@example.com",
  "John",
  499,
  "INR",
  "pay_123"
);
```

**Configuration:**

- Priority: OTP emails = 1 (highest), others = 2
- Retry: 3 attempts with exponential backoff
- Cleanup: Completed jobs removed, failed jobs kept

### Scheduler Queue (`scheduler.queue.ts`)

Handles recurring/scheduled jobs.

```typescript
// Jobs are automatically set up on startup via setupScheduledJobs()
// You don't need to call this manually

// To check scheduled jobs status:
import { getScheduledJobsStatus } from "./jobs";
const status = await getScheduledJobsStatus();
console.log(status);
// { repeatable: [...], counts: { waiting: 0, active: 0, failed: 0 } }
```

---

## Workers

### Email Worker (`email.worker.ts`)

Processes email jobs by sending emails via Nodemailer.

| Job Type          | Description                       |
| ----------------- | --------------------------------- |
| `OTP`             | Sends OTP verification emails     |
| `PAYMENT_SUCCESS` | Sends payment confirmation emails |

### Scheduler Worker (`scheduler.worker.ts`)

Processes scheduled maintenance tasks.

| Job Type               | Frequency      | Description                            |
| ---------------------- | -------------- | -------------------------------------- |
| `expire-subscriptions` | Every 1 hour   | Marks expired subscriptions as EXPIRED |
| `cleanup-expired-otps` | Every 6 hours  | Deletes OTP records past expiry        |
| `cleanup-old-sessions` | Every 24 hours | Deletes sessions older than 30 days    |

---

## Scheduled Jobs

### How They Work

```
Startup:
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  1. initializeWorkers() is called                               │
│                    │                                             │
│                    ▼                                             │
│  2. setupScheduledJobs() registers repeatable jobs in Redis     │
│                    │                                             │
│                    ▼                                             │
│  3. Workers start listening for jobs                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Running:
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Every hour (example for expire-subscriptions):                 │
│                                                                  │
│  1. BullMQ sees it's time for next execution                    │
│                    │                                             │
│                    ▼                                             │
│  2. Creates a job in the scheduler queue                        │
│                    │                                             │
│                    ▼                                             │
│  3. ONE worker (any replica) picks up the job                   │
│                    │                                             │
│                    ▼                                             │
│  4. Worker calls handleExpireSubscriptions()                    │
│                    │                                             │
│                    ▼                                             │
│  5. Job marked as completed                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Job Schedule

| Job                  | Interval | Next Run Calculation     |
| -------------------- | -------- | ------------------------ |
| expire-subscriptions | 1 hour   | `60 * 60 * 1000` ms      |
| cleanup-expired-otps | 6 hours  | `6 * 60 * 60 * 1000` ms  |
| cleanup-old-sessions | 24 hours | `24 * 60 * 60 * 1000` ms |

---

## How It Works in Docker Swarm

This is the **key reason** we use BullMQ instead of `setInterval()`.

### The Problem with setInterval

```
Without BullMQ (setInterval):
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Replica 1  │  │  Replica 2  │  │  Replica 3  │
│ setInterval │  │ setInterval │  │ setInterval │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       ▼                ▼                ▼
   Job runs         Job runs         Job runs

❌ SAME JOB RUNS 3 TIMES!
```

### The Solution with BullMQ

```
With BullMQ:
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Replica 1  │  │  Replica 2  │  │  Replica 3  │
│   Worker    │  │   Worker    │  │   Worker    │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
                        ▼
               ┌─────────────────┐
               │      Redis      │
               │   Job Queue     │
               │                 │
               │ Job: expire-sub │
               │ Status: waiting │
               └────────┬────────┘
                        │
                        ▼
           ONLY ONE worker picks it up

✅ JOB RUNS EXACTLY ONCE
```

### Why This Works

1. **Redis as single source of truth** - Job exists in ONE place
2. **Atomic operations** - BullMQ uses Redis transactions
3. **Lock mechanism** - Only one worker can claim a job
4. **Idempotent setup** - setupScheduledJobs() clears and recreates jobs on each deploy

---

## Adding New Jobs

### Adding a New Scheduled Job

1. **Add job type to `scheduler.queue.ts`:**

```typescript
export type ScheduledJobType =
  | "expire-subscriptions"
  | "cleanup-expired-otps"
  | "cleanup-old-sessions"
  | "your-new-job"; // Add here
```

2. **Register the job in `setupScheduledJobs()`:**

```typescript
await schedulerQueue.add(
  "your-new-job",
  { description: "What this job does" },
  {
    repeat: {
      every: 30 * 60 * 1000, // Every 30 minutes
    },
    jobId: "your-new-job",
  }
);
```

3. **Add handler in `scheduler.worker.ts`:**

```typescript
case "your-new-job":
  await handleYourNewJob();
  break;

// And create the handler function:
async function handleYourNewJob(): Promise<void> {
  // Your logic here
  logger.info("Your new job executed");
}
```

### Adding a New Email Type

1. **Add type to `types.ts`:**

```typescript
export type EmailJobType = "OTP" | "PAYMENT_SUCCESS" | "YOUR_NEW_TYPE";
```

2. **Add queue helper in `email.queue.ts`:**

```typescript
export async function queueYourNewEmail(
  email: string,
  data: YourData
): Promise<void> {
  await addEmailJob({
    type: "YOUR_NEW_TYPE",
    to: email,
    subject: "Your Subject",
    ...data,
  });
}
```

3. **Add handler in `email.worker.ts`:**

```typescript
case "YOUR_NEW_TYPE":
  html = generateYourNewEmailTemplate(job.data);
  break;
```

---

## Monitoring & Debugging

### Check Job Status via Code

```typescript
import { getScheduledJobsStatus, schedulerQueue } from "./jobs";

// Get scheduled jobs overview
const status = await getScheduledJobsStatus();
console.log(status);

// Get failed jobs
const failed = await schedulerQueue.getFailed();
console.log(failed);

// Get completed jobs (last 100)
const completed = await schedulerQueue.getCompleted();
console.log(completed);
```

### Logs to Watch

```
# Startup
INFO: Initializing background workers...
INFO: Scheduled jobs configured { jobs: [...] }
INFO: Background workers initialized { workers: ["email", "scheduler"] }

# Job execution
INFO: Scheduled job started: expire-subscriptions { jobId: "..." }
INFO: Marked 5 subscriptions as expired
INFO: Scheduled job completed: expire-subscriptions { jobId: "...", durationMs: 123 }

# Errors
ERROR: Scheduled job failed: expire-subscriptions { jobId: "...", error: "..." }
```

### Add Bull Board (Optional)

For a web UI to monitor jobs, you can add Bull Board:

```bash
npm install @bull-board/express @bull-board/api
```

```typescript
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullMQAdapter(emailQueue), new BullMQAdapter(schedulerQueue)],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());
```

---

## Summary

| Feature          | Implementation                               |
| ---------------- | -------------------------------------------- |
| Email processing | `email.queue.ts` + `email.worker.ts`         |
| Scheduled tasks  | `scheduler.queue.ts` + `scheduler.worker.ts` |
| Cluster safety   | BullMQ + Redis distributed lock              |
| Retry on failure | 3 attempts with exponential backoff          |
| Job persistence  | Redis-backed                                 |
| Initialization   | `initializeWorkers()` in `index.ts`          |
| Shutdown         | `shutdownWorkers()` for graceful stop        |

The system is designed to be **reliable** (survives restarts), **scalable** (works with multiple replicas), and **maintainable** (clear separation of concerns).
