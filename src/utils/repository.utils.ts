import logger from "../config/logger";

// Prisma error codes
export const PRISMA_ERROR = {
  RECORD_NOT_FOUND: "P2025",
  UNIQUE_CONSTRAINT_VIOLATION: "P2002",
  FOREIGN_KEY_CONSTRAINT_VIOLATION: "P2003",
} as const;

// Type guard for Prisma errors
export function isPrismaError(
  error: unknown
): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

// Repository result types (discriminated union pattern)
export type SuccessResult<T> = {
  success: true;
  data: T;
};

export type ErrorType =
  | "NOT_FOUND"
  | "DUPLICATE"
  | "IN_USE"
  | "FORBIDDEN"
  | "INVALID_REFERENCE"
  | "UNKNOWN";

export type ErrorResult = {
  success: false;
  error: ErrorType;
  statusCode: number;
  message: string;
};

export type RepositoryResult<T> = SuccessResult<T> | ErrorResult;

// Pagination types
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

// Helper to create pagination meta
export function createPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

// Standard error responses
export function notFoundError(entity: string): ErrorResult {
  return {
    success: false,
    error: "NOT_FOUND",
    statusCode: 404,
    message: `${entity} not found`,
  };
}

export function duplicateError(message: string): ErrorResult {
  return {
    success: false,
    error: "DUPLICATE",
    statusCode: 409,
    message,
  };
}

export function inUseError(message: string): ErrorResult {
  return {
    success: false,
    error: "IN_USE",
    statusCode: 409,
    message,
  };
}

export function unknownError(operation: string, error: unknown): ErrorResult {
  logger.error(`${operation} failed`, { error });
  return {
    success: false,
    error: "UNKNOWN",
    statusCode: 500,
    message: `Failed to ${operation.toLowerCase()}`,
  };
}
