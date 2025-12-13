import type { Response } from "express";

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

export function sendApiResponse<T = unknown>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null
): Response<ApiResponse<T>> {
  return res.status(statusCode).json({
    statusCode,
    success: statusCode < 400,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}
