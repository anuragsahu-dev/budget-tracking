import type { Response } from "express";

export function sendApiResponse<T = unknown>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null
): Response {
  return res.status(statusCode).json({
    statusCode,
    success: statusCode < 400,
    message,
    data,
  });
}
