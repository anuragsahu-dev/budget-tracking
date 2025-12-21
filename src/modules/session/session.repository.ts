import prisma from "../../config/prisma";
import { Session } from "../../generated/prisma/client";
import {
  PRISMA_ERROR,
  isPrismaError,
  RepositoryResult,
  notFoundError,
  unknownError,
} from "../../utils/repository.utils";

export class SessionRepository {
  static async createSession(data: {
    userId: string;
    refreshTokenHash: string;
    expireAt: Date;
  }): Promise<RepositoryResult<Session>> {
    try {
      const session = await prisma.session.create({ data });
      return { success: true, data: session };
    } catch (error) {
      return unknownError("Failed to create session", error);
    }
  }

  static async findActiveSessionByTokenHash(refreshTokenHash: string) {
    return prisma.session.findFirst({
      where: {
        refreshTokenHash,
        isRevoked: false,
        expireAt: { gt: new Date() },
      },
      include: { user: { select: { id: true, role: true, status: true } } },
    });
  }

  static async countActiveSessions(userId: string): Promise<number> {
    return prisma.session.count({
      where: {
        userId,
        isRevoked: false,
        expireAt: { gt: new Date() },
      },
    });
  }

  static async revokeSession(id: string): Promise<RepositoryResult<Session>> {
    try {
      const session = await prisma.session.update({
        where: { id },
        data: { isRevoked: true },
      });
      return { success: true, data: session };
    } catch (error) {
      if (
        isPrismaError(error) &&
        error.code === PRISMA_ERROR.RECORD_NOT_FOUND
      ) {
        return notFoundError("Session not found");
      }
      return unknownError("Failed to revoke session", error);
    }
  }

  static async revokeSessionByTokenHash(
    refreshTokenHash: string
  ): Promise<RepositoryResult<Session>> {
    try {
      const result = await prisma.session.updateMany({
        where: { refreshTokenHash },
        data: { isRevoked: true },
      });

      if (result.count === 0) {
        return notFoundError("Session not found or already revoked");
      }

      return { success: true, data: {} as Session };
    } catch (error) {
      return unknownError("Failed to revoke session", error);
    }
  }

  static async revokeAllUserSessions(
    userId: string
  ): Promise<RepositoryResult<{ count: number }>> {
    try {
      const result = await prisma.session.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
      return { success: true, data: { count: result.count } };
    } catch (error) {
      return unknownError("Failed to revoke all sessions", error);
    }
  }

  static async revokeOldestSession(userId: string): Promise<boolean> {
    try {
      const oldestSession = await prisma.session.findFirst({
        where: {
          userId,
          isRevoked: false,
          expireAt: { gt: new Date() },
        },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });

      if (oldestSession) {
        await prisma.session.update({
          where: { id: oldestSession.id },
          data: { isRevoked: true },
        });
        return true;
      }
      return false; // No session to revoke
    } catch {
      // Don't throw — this is a cleanup operation, not critical
      return false;
    }
  }
}
