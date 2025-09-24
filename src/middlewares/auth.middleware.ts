import jwt from "jsonwebtoken";
import { ApiError } from "./error.middleware";

import type { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

import { config } from "../config/config";
import { Role } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    userRole?: Role;
  }
}

interface AccessTokenPayload extends JwtPayload {
  id: string;
  role: Role;
}

export const verifyJWT = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return next(new ApiError(401, "Authentication failed. Please log in."));
    }

    const decoded = jwt.verify(
      accessToken,
      config.auth.accessTokenSecret
    ) as AccessTokenPayload;

    if (!decoded?.id) {
      return next(new ApiError(401, "Authentication failed. Please log in."));
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (_error) {
    return next(new ApiError(401, "Authentication failed. Please log in."));
  }
};

/*
✅ Best practice
Use next(error) in middleware (like verifyJWT).
Use throw in controllers wrapped with asyncHandler (because your wrapper will catch it and call next(error) for you).
*/
