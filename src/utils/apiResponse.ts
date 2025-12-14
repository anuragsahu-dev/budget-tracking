import type { Response } from "express";

// Pagination meta type
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

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
