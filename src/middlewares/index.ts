/**
 * Middlewares Index - Central export point for middleware
 */

// Authentication
export { verifyJWT } from "./auth.middleware";

// Error handling
export { ApiError, globalErrorHandler } from "./error.middleware";

// Rate limiting
export { globalLimiter, startLimiter } from "./rateLimit.middleware";

// Role-based access
export { requireRole, requireAdmin } from "./role.middleware";

// Validation
export { validate } from "./validate.middleware";
