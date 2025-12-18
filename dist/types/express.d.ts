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
            rawBody?: string;
        }
    }
}
export declare function getValidatedBody<T>(req: Request): T;
export declare function getValidatedParams<T>(req: Request): T;
export declare function getValidatedQuery<T>(req: Request): T;
