import type { Request, Response, NextFunction, RequestHandler } from "express";
import { config } from "../config/config";
import logger from "../config/logger";

type Errors = string | object | (string | object)[];

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly status: "fail" | "error";
  public readonly isOperational: boolean;
  public readonly errors: (string | object)[];

  constructor(
    statusCode: number,
    message: string,
    errors: Errors = [],
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = isOperational;

    if (
      typeof errors === "string" ||
      (typeof errors === "object" && !Array.isArray(errors))
    ) {
      this.errors = [errors];
    } else if (Array.isArray(errors)) {
      this.errors = errors;
    } else {
      this.errors = [];
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      logger.error("Unhandled error in asyncHandler", {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });
      next(error);
    }
  };
};

// sending consistent response
interface ErrorResponse {
  status: "fail" | "error";
  message: string;
  errors: (string | object)[];
  stack?: string;
}

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error: ApiError;

  if (err instanceof ApiError) {
    error = err;
  } else if (err instanceof Error) {
    error = new ApiError(
      500,
      err.message || "Something went wrong!",
      [],
      false
    );
    error.stack = err.stack; // preserve the original stack
  } else {
    error = new ApiError(500, "Something went wrong!", [], false);
  }

  const statusCode = error.statusCode || 500;
  const status = error.status || "error";

  if (config.server.nodeEnv === "development") {
    // Development error response
    const response: ErrorResponse = {
      status,
      message: error.message,
      errors: error.errors,
      stack: error.stack,
    };
    res.status(statusCode).json(response);
  } else {
    // Operational, trusted error: send message to client
    if (error.isOperational) {
      const response: ErrorResponse = {
        status,
        message: error.message,
        errors: error.errors,
      };
      res.status(statusCode).json(response);
    } else {
      // Programming or other unknown error: don't leak error details
      console.error("💥 Unexpected Error:", error);
      const response: ErrorResponse = {
        status: "error",
        message: "Something went wrong!",
        errors: [],
      };
      res.status(500).json(response);
    }
  }
};
