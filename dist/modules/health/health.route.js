"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullHealthStatus = getFullHealthStatus;
const express_1 = require("express");
const os_1 = require("os");
const prisma_1 = __importDefault(require("../../config/prisma"));
const redis_1 = __importDefault(require("../../config/redis"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const client_1 = require("../../generated/prisma/client");
const router = (0, express_1.Router)();
router.get("/", (_req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});
router.get("/live", (_req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});
router.get("/ready", async (_req, res) => {
    const checks = {};
    let overallStatus = "healthy";
    const dbStart = Date.now();
    try {
        await prisma_1.default.$queryRaw `SELECT 1`;
        checks.database = {
            status: "up",
            latency: Date.now() - dbStart,
        };
    }
    catch (_error) {
        checks.database = {
            status: "down",
            latency: Date.now() - dbStart,
            message: "Database connection failed",
        };
        overallStatus = "unhealthy";
    }
    const redisStart = Date.now();
    try {
        await redis_1.default.ping();
        checks.redis = {
            status: "up",
            latency: Date.now() - redisStart,
        };
    }
    catch (_error) {
        checks.redis = {
            status: "down",
            latency: Date.now() - redisStart,
            message: "Redis connection failed",
        };
        overallStatus = "unhealthy";
    }
    const response = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        checks,
    };
    const statusCode = overallStatus === "healthy" ? 200 : 503;
    res.status(statusCode).json(response);
});
async function getFullHealthStatus() {
    const checks = {};
    let overallStatus = "healthy";
    const dbStart = Date.now();
    try {
        await prisma_1.default.$queryRaw `SELECT 1`;
        checks.database = {
            status: "up",
            latency: Date.now() - dbStart,
        };
    }
    catch (error) {
        checks.database = {
            status: "down",
            latency: Date.now() - dbStart,
            message: error instanceof Error ? error.message : "Connection failed",
        };
        overallStatus = "unhealthy";
    }
    const redisStart = Date.now();
    try {
        await redis_1.default.ping();
        checks.redis = {
            status: "up",
            latency: Date.now() - redisStart,
        };
    }
    catch (error) {
        checks.redis = {
            status: "down",
            latency: Date.now() - redisStart,
            message: error instanceof Error ? error.message : "Connection failed",
        };
        overallStatus = "unhealthy";
    }
    const memUsage = process.memoryUsage();
    const totalMem = (0, os_1.totalmem)();
    const usedMem = memUsage.heapUsed;
    const system = {
        nodeVersion: process.version,
        platform: process.platform,
        memory: {
            used: Math.round(usedMem / 1024 / 1024),
            total: Math.round(totalMem / 1024 / 1024),
            percentage: Math.round((usedMem / totalMem) * 100),
        },
    };
    return {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: Math.round(process.uptime()),
        checks,
        system,
    };
}
router.get("/admin", auth_middleware_1.verifyJWT, (0, role_middleware_1.requireRole)(client_1.UserRole.ADMIN), async (_req, res) => {
    const health = await getFullHealthStatus();
    const statusCode = health.status === "healthy" ? 200 : 503;
    res.status(statusCode).json(health);
});
exports.default = router;
