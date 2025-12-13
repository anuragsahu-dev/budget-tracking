import type { Request } from "express";
import type { ParsedQs } from "qs";
import type { UserRole } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: UserRole;
      validatedQuery?: ParsedQs;
      validatedBody?: Record<string, unknown>;
      validatedParams?: Record<string, unknown>;
    }
  }
}

export function getValidatedBody<T>(req: Request): T {
  return (req.validatedBody ?? {}) as T;
}

export function getValidatedParams<T>(req: Request): T {
  return (req.validatedParams ?? {}) as T;
}

export function getValidatedQuery<T>(req: Request): T {
  return (req.validatedQuery ?? {}) as T;
}
