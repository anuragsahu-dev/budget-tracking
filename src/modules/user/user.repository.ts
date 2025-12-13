import prisma from "../../config/prisma";
import { Prisma } from "../../generated/prisma/client";
import logger from "../../config/logger";

// Prisma error codes as named constants
const PRISMA_ERROR = {
  RECORD_NOT_FOUND: "P2025",
  UNIQUE_CONSTRAINT_VIOLATION: "P2002",
  FOREIGN_KEY_CONSTRAINT_VIOLATION: "P2003",
  REQUIRED_RELATION_NOT_SATISFIED: "P2014",
} as const;

// Type guard to check if error is a Prisma known request error
function isPrismaError(
  error: unknown
): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

// Result type for operations that might fail
export type RepositoryResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: "NOT_FOUND" | "DUPLICATE" | "UNKNOWN";
      message: string;
    };

export class UserRepository {
  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  static async findUserById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  static async createUser(
    data: Prisma.UserCreateInput
  ): Promise<RepositoryResult<Prisma.UserGetPayload<object>>> {
    try {
      const user = await prisma.user.create({
        data,
      });
      return { success: true, data: user };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
          return {
            success: false,
            error: "DUPLICATE",
            message: "User with this email already exists",
          };
        }
      }
      logger.error("UserRepository.createUser failed", { error });
      return {
        success: false,
        error: "UNKNOWN",
        message: "Failed to create user",
      };
    }
  }

  static async updateUser(
    id: string,
    data: Prisma.UserUpdateInput
  ): Promise<RepositoryResult<Prisma.UserGetPayload<object>>> {
    try {
      const user = await prisma.user.update({
        where: {
          id,
        },
        data,
      });
      return { success: true, data: user };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
          return {
            success: false,
            error: "NOT_FOUND",
            message: "User not found",
          };
        }
        if (error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
          return {
            success: false,
            error: "DUPLICATE",
            message: "Email already in use",
          };
        }
      }
      logger.error("UserRepository.updateUser failed", { id, error });
      return {
        success: false,
        error: "UNKNOWN",
        message: "Failed to update user",
      };
    }
  }

  static async deleteUser(
    id: string
  ): Promise<RepositoryResult<Prisma.UserGetPayload<object>>> {
    try {
      const user = await prisma.user.delete({
        where: {
          id,
        },
      });
      return { success: true, data: user };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
          return {
            success: false,
            error: "NOT_FOUND",
            message: "User not found",
          };
        }
      }
      logger.error("UserRepository.deleteUser failed", { id, error });
      return {
        success: false,
        error: "UNKNOWN",
        message: "Failed to delete user",
      };
    }
  }
}
