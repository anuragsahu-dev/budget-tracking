/**
 * Utils Index - Central export point for utility functions
 */

// API Response
export { sendApiResponse } from "./apiResponse";
export type { ApiResponse, PaginationMeta } from "./apiResponse";

// Async Handler
export { asyncHandler } from "./asyncHandler";

// Repository utilities
export {
  PRISMA_ERROR,
  isPrismaError,
  createPaginationMeta,
  notFoundError,
  duplicateError,
  inUseError,
  unknownError,
} from "./repository.utils";
export type {
  SuccessResult,
  ErrorResult,
  ErrorType,
  RepositoryResult,
  PaginatedResult,
} from "./repository.utils";

// Slug utilities
export { generateSlug } from "./slug";
