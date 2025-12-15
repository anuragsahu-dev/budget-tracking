import type { Response } from "express";
import type { PaginationMeta } from "./repository.utils";

// Re-export for convenience
export type { PaginationMeta };

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T | null;
  meta?: PaginationMeta;
  timestamp: string;
}

export function sendApiResponse<T = unknown>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null,
  meta?: PaginationMeta
): Response<ApiResponse<T>> {
  return res.status(statusCode).json({
    statusCode,
    success: statusCode < 400,
    message,
    data,
    ...(meta && { meta }),
    timestamp: new Date().toISOString(),
  });
}
