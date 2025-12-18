declare const router: import("express-serve-static-core").Router;
interface HealthStatus {
    status: "healthy" | "unhealthy" | "degraded";
    timestamp: string;
    uptime?: number;
    checks?: Record<string, ServiceCheck>;
    system?: SystemInfo;
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
export declare function getFullHealthStatus(): Promise<HealthStatus>;
export default router;
