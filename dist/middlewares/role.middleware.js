"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireRole = void 0;
const error_middleware_1 = require("./error.middleware");
const asyncHandler_1 = require("../utils/asyncHandler");
const requireRole = (...allowedRoles) => {
    return (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
        const userRole = req.userRole;
        if (!userRole) {
            throw new error_middleware_1.ApiError(401, "Authentication required");
        }
        if (!allowedRoles.includes(userRole)) {
            throw new error_middleware_1.ApiError(403, "You do not have permission to perform this action");
        }
        next();
    });
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)("ADMIN");
