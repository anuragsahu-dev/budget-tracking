import jwt from "jsonwebtoken";
import { ApiError } from "./error.middleware";
import logger from "../config/logger";

import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";

import { config } from "../config/config";
import { UserRole } from "../generated/prisma/client";
import { asyncHandler } from "../utils/asyncHandler";

interface AccessTokenPayload extends JwtPayload {
  id: string;
  role: UserRole;
}

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

      req.userId = decoded.id;
      req.userRole = decoded.role;
      next();
    } catch (error) {
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
