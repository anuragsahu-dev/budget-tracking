/**
 * Unit Tests - Repository Utilities
 */

import { describe, it, expect } from "vitest";
import {
  createPaginationMeta,
  notFoundError,
  duplicateError,
  isPrismaError,
} from "../../src/utils/repository.utils";

describe("createPaginationMeta", () => {
  it("calculates total pages correctly", () => {
    const meta = createPaginationMeta(100, 1, 10);
    expect(meta.totalPages).toBe(10);
  });

  it("returns hasNextPage true on first page", () => {
    const meta = createPaginationMeta(50, 1, 10);
    expect(meta.hasNextPage).toBe(true);
    expect(meta.hasPrevPage).toBe(false);
  });

  it("returns hasPrevPage true on last page", () => {
    const meta = createPaginationMeta(50, 5, 10);
    expect(meta.hasNextPage).toBe(false);
    expect(meta.hasPrevPage).toBe(true);
  });
});

describe("notFoundError", () => {
  it("returns 404 status code", () => {
    const error = notFoundError("User not found");
    expect(error.statusCode).toBe(404);
    expect(error.error).toBe("NOT_FOUND");
    expect(error.success).toBe(false);
  });
});

describe("duplicateError", () => {
  it("returns 409 status code", () => {
    const error = duplicateError("Email already exists");
    expect(error.statusCode).toBe(409);
    expect(error.error).toBe("DUPLICATE");
  });
});

describe("isPrismaError", () => {
  it("returns true for Prisma-like error", () => {
    const prismaError = { code: "P2025", message: "Record not found" };
    expect(isPrismaError(prismaError)).toBe(true);
  });

  it("returns false for regular Error", () => {
    const regularError = new Error("Something went wrong");
    expect(isPrismaError(regularError)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isPrismaError(null)).toBe(false);
  });
});
