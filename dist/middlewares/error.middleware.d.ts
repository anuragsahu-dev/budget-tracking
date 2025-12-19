import type { Request, Response, NextFunction } from "express";
type Errors = string | object | (string | object)[];
export declare class ApiError extends Error {
    readonly statusCode: number;
    readonly status: "fail" | "error";
    readonly isOperational: boolean;
    readonly errors: (string | object)[];
    constructor(statusCode: number, message: string, errors?: Errors, isOperational?: boolean);
}
export declare const globalErrorHandler: (err: unknown, req: Request, res: Response, _next: NextFunction) => void;
export {};
