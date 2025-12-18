import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
interface ValidationSchemas {
    body?: ZodType<unknown>;
    params?: ZodType<unknown>;
    query?: ZodType<unknown>;
}
export declare const validate: (schemas: ValidationSchemas) => (req: Request, _res: Response, next: NextFunction) => void;
export {};
