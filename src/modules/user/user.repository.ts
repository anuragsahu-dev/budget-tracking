import prisma from "../../config/prisma";
import { Prisma, User } from "../../generated/prisma/client";
import logger from "../../config/logger";

const PRISMA_ERROR = {
  RECORD_NOT_FOUND: "P2025",
  UNIQUE_CONSTRAINT_VIOLATION: "P2002",
  FOREIGN_KEY_CONSTRAINT_VIOLATION: "P2003",
  REQUIRED_RELATION_NOT_SATISFIED: "P2014",
} as const;

// Since we catch `unknown` errors, we need a type guard to safely check
// if the error is a Prisma error with a `code` property
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

// These types use the "discriminated union" pattern with `success` as the
// discriminant. This allows TypeScript to narrow types correctly:
//
// Example usage:
//   const result = await UserRepository.createUser(data);
//   if (result.success) {
//     // TypeScript knows: result.data is User (not undefined)
//   } else {
//     // TypeScript knows: result.error, result.statusCode, result.message exist
//   }

type SuccessResult<T> = {
  success: true;
  data: T;
};

type ErrorResult = {
  success: false;
  error: "NOT_FOUND" | "DUPLICATE" | "UNKNOWN";
  statusCode: number;
  message: string;
};

type RepositoryResult<T> = SuccessResult<T> | ErrorResult;
export class UserRepository {
  static async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async createUser(
    data: Prisma.UserCreateInput
  ): Promise<RepositoryResult<User>> {
    try {
      const user = await prisma.user.create({ data });
      return { success: true, data: user };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
          return {
            success: false,
            error: "DUPLICATE",
            statusCode: 409,
            message: "User with this email already exists",
          };
        }
      }


      logger.error("UserRepository.createUser failed", { error });
      return {
        success: false,
        error: "UNKNOWN",
        statusCode: 500,
        message: "Failed to create user",
      };
    }
  }

  static async updateUser(
    id: string,
    data: Prisma.UserUpdateInput
  ): Promise<RepositoryResult<User>> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data,
      });
      return { success: true, data: user };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
          return {
            success: false,
            error: "NOT_FOUND",
            statusCode: 404,
            message: "User not found",
          };
        }
        if (error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
          return {
            success: false,
            error: "DUPLICATE",
            statusCode: 409,
            message: "Email already in use",
          };
        }
      }

      logger.error("UserRepository.updateUser failed", { id, error });
      return {
        success: false,
        error: "UNKNOWN",
        statusCode: 500,
        message: "Failed to update user",
      };
    }
  }

  static async deleteUser(id: string): Promise<RepositoryResult<User>> {
    try {
      const user = await prisma.user.delete({
        where: { id },
      });
      return { success: true, data: user };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
          return {
            success: false,
            error: "NOT_FOUND",
            statusCode: 404,
            message: "User not found",
          };
        }
      }

      logger.error("UserRepository.deleteUser failed", { id, error });
      return {
        success: false,
        error: "UNKNOWN",
        statusCode: 500,
        message: "Failed to delete user",
      };
    }
  }
}
