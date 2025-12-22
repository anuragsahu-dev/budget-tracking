import { Router, Request, Response } from "express";
import { totalmem } from "node:os";
import prisma from "../../config/prisma";
import redis from "../../config/redis";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { UserRole } from "../../generated/prisma/client";
import { getScheduledJobsStatus } from "../../jobs/queues/scheduler.queue";

const router = Router();

/**
 * Health Check Endpoints
 *
 * Different endpoints for different purposes:
 * - GET /health       → Liveness probe (is the app running?)
 * - GET /health/ready → Readiness probe (can accept traffic?)
 * - GET /health/live  → Alias for liveness
 *
 * For full diagnostics, use GET /api/v1/admin/health (admin only)
 */

interface SchedulerInfo {
  id: string | null | undefined;
  name: string;
  every: number | undefined;
  next: string | null;
}

interface HealthStatus {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  uptime?: number;
  checks?: Record<string, ServiceCheck>;
  system?: SystemInfo;
  schedulers?: {
    count: number;
    jobs: SchedulerInfo[];
    queues: {
      waiting: number;
      active: number;
      failed: number;
    };
  };
}

interface ServiceCheck {
  status: "up" | "down" | "degraded";
  latency?: number;
  message?: string;
}

interface SystemInfo {
  nodeVersion: string;
  platform: string;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu?: NodeJS.CpuUsage;
}

// ============================================================
// PUBLIC: Liveness Probe - Is the app running?
// Used by: Docker HEALTHCHECK, Kubernetes livenessProbe
// Note: These endpoints are NOT in /api/v1 - they're at /health
// ============================================================
router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

router.get("/live", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// PUBLIC: Readiness Probe - Can the app accept traffic?
// Used by: Kubernetes readinessProbe, Load balancers
// Checks: Database and Redis connectivity
// ============================================================
router.get("/ready", async (_req: Request, res: Response) => {
  const checks: Record<string, ServiceCheck> = {};
  let overallStatus: "healthy" | "unhealthy" | "degraded" = "healthy";

  // Check Database
  const dbStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = {
      status: "up",
      latency: Date.now() - dbStart,
    };
  } catch (_error) {
    checks.database = {
      status: "down",
      latency: Date.now() - dbStart,
      message: "Database connection failed",
    };
    overallStatus = "unhealthy";
  }

  // Check Redis
  const redisStart = Date.now();
  try {
    await redis.ping();
    checks.redis = {
      status: "up",
      latency: Date.now() - redisStart,
    };
  } catch (_error) {
    checks.redis = {
      status: "down",
      latency: Date.now() - redisStart,
      message: "Redis connection failed",
    };
    overallStatus = "unhealthy";
  }

  const response: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    checks,
  };

  const statusCode = overallStatus === "healthy" ? 200 : 503;
  res.status(statusCode).json(response);
});

// ============================================================
// ADMIN ONLY: Full System Diagnostics
// Used by: Admin dashboard, debugging
// Includes: All service checks, memory, uptime, versions, schedulers
// ============================================================
export async function getFullHealthStatus(): Promise<HealthStatus> {
  const checks: Record<string, ServiceCheck> = {};
  let overallStatus: "healthy" | "unhealthy" | "degraded" = "healthy";

  // Check Database with query
  const dbStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = {
      status: "up",
      latency: Date.now() - dbStart,
    };
  } catch (error) {
    checks.database = {
      status: "down",
      latency: Date.now() - dbStart,
      message: error instanceof Error ? error.message : "Connection failed",
    };
    overallStatus = "unhealthy";
  }

  // Check Redis
  const redisStart = Date.now();
  try {
    await redis.ping();
    checks.redis = {
      status: "up",
      latency: Date.now() - redisStart,
    };
  } catch (error) {
    checks.redis = {
      status: "down",
      latency: Date.now() - redisStart,
      message: error instanceof Error ? error.message : "Connection failed",
    };
    overallStatus = "unhealthy";
  }

  // Get memory usage
  const memUsage = process.memoryUsage();
  const totalMem = totalmem();
  const usedMem = memUsage.heapUsed;

  const system: SystemInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    memory: {
      used: Math.round(usedMem / 1024 / 1024), // MB
      total: Math.round(totalMem / 1024 / 1024), // MB
      percentage: Math.round((usedMem / totalMem) * 100),
    },
  };

  // Get scheduler status
  const schedulerStatus = await getScheduledJobsStatus();

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    checks,
    system,
    schedulers: {
      count: schedulerStatus.schedulers.length,
      jobs: schedulerStatus.schedulers,
      queues: schedulerStatus.counts,
    },
  };
}

// Admin endpoint for full diagnostics (at /health/admin, not /api/v1)
router.get(
  "/admin",
  verifyJWT,
  requireRole(UserRole.ADMIN),
  async (_req: Request, res: Response) => {
    const health = await getFullHealthStatus();
    const statusCode = health.status === "healthy" ? 200 : 503;
    res.status(statusCode).json(health);
  }
);

export default router;
