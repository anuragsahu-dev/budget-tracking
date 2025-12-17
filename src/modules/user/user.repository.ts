import prisma from "../../config/prisma";
import { Prisma, User } from "../../generated/prisma/client";
import {
  PRISMA_ERROR,
  isPrismaError,
  RepositoryResult,
  notFoundError,
  duplicateError,
  unknownError,
} from "../../utils/repository.utils";

export class UserRepository {
  static async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  static async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  static async createUser(
    data: Prisma.UserCreateInput
  ): Promise<RepositoryResult<User>> {
    try {
      const user = await prisma.user.create({ data });
      return { success: true, data: user };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION
      ) {
        return duplicateError("User with this email already exists");
      }
      return unknownError("Failed to create user", error);
    }
  }

  static async updateUser(
    id: string,
    data: Prisma.UserUpdateInput
  ): Promise<RepositoryResult<User>> {
    try {
      const user = await prisma.user.update({ where: { id }, data });
      return { success: true, data: user };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
          return notFoundError("User not found");
        }
        if (error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
          return duplicateError("Email already in use");
        }
      }
      return unknownError("Failed to update user", error);
    }
  }

  static async deleteUser(id: string): Promise<RepositoryResult<User>> {
    try {
      const user = await prisma.user.delete({ where: { id } });
      return { success: true, data: user };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("User not found");
      }
      return unknownError("Failed to delete user", error);
    }
  }
}
