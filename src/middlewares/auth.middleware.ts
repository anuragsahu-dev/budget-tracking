import jwt from "jsonwebtoken";
import { ApiError } from "./error.middleware";
import logger from "../config/logger";

import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";

import { config } from "../config/config";
import { UserRole, UserStatus } from "../generated/prisma/client";
import { asyncHandler } from "../utils/asyncHandler";

interface AccessTokenPayload extends JwtPayload {
  id: string;
  role: UserRole;
  status: UserStatus;
}

/**
 * JWT Authentication Middleware
 *
 * Strategy: Status is embedded in JWT payload (no DB call per request)
 * - On login/refresh: status is fetched from DB and embedded in token
 * - On every request: status is read from token (fast!)
 * - On admin ban/deactivate: sessions are revoked, forcing re-login which will fail
 * - Max delay for ban to take effect: 15 min (access token expiry)
 */
export const verifyJWT = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const accessToken = req.cookies.accessToken || token;

    if (!accessToken) {
      throw new ApiError(401, "Authentication failed. Please log in.");
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        config.auth.accessTokenSecret
      ) as AccessTokenPayload;

      if (!decoded.id) {
        logger.warn("Access token decoded, but have invalid payload", {
          ip: req.ip,
        });
        throw new ApiError(401, "Authentication failed. Please log in.");
      }

      // Check status from JWT payload (no DB call!)
      if (decoded.status !== UserStatus.ACTIVE) {
        const statusMessages: Record<UserStatus, string> = {
          [UserStatus.ACTIVE]: "",
          [UserStatus.INACTIVE]:
            "Your account is deactivated. Contact support to reactivate.",
          [UserStatus.SUSPENDED]:
            "Your account has been suspended. Contact support.",
          [UserStatus.DELETED]: "This account no longer exists.",
        };
        throw new ApiError(403, statusMessages[decoded.status]);
      }

      req.userId = decoded.id;
      req.userRole = decoded.role;
      next();
    } catch (error) {
      if (error instanceof ApiError) {
        return next(error);
      }
      logger.error("Access Token Verification failed", {
        error: error,
        ip: req.ip,
      });
      return next(new ApiError(401, "Authentication failed. Please log in."));
    }
  }
);

/*
Best practice
Use next(error) in middleware (like verifyJWT).
Use throw in controllers wrapped with asyncHandler (because your wrapper will catch it and call next(error) for you).
*/
