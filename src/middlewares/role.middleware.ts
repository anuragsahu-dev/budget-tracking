import type { Request, Response, NextFunction } from "express";
import { ApiError } from "./error.middleware";
import { UserRole } from "../generated/prisma/client";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * Middleware to check if user has the required role
 * Must be used AFTER verifyJWT middleware
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
      const userRole = req.userRole;

      if (!userRole) {
        throw new ApiError(401, "Authentication required");
      }

      if (!allowedRoles.includes(userRole)) {
        throw new ApiError(
          403,
          "You do not have permission to perform this action"
        );
      }

      next();
    }
  );
};

/**
 * Shorthand middleware for admin-only routes
 */
export const requireAdmin = requireRole("ADMIN");
