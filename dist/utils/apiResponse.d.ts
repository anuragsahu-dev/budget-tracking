import type { Response } from "express";
import type { PaginationMeta } from "./repository.utils";
export type { PaginationMeta };
export interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T | null;
    meta?: PaginationMeta;
    timestamp: string;
}
export declare function sendApiResponse<T = unknown>(res: Response, statusCode: number, message: string, data?: T | null, meta?: PaginationMeta): Response<ApiResponse<T>>;
