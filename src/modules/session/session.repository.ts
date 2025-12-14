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
      return unknownError("create session", error);
    }
  }

  static async findActiveSessionByTokenHash(
    refreshTokenHash: string
  ): Promise<Session | null> {
    return prisma.session.findFirst({
      where: {
        refreshTokenHash,
        isRevoked: false,
        expireAt: { gt: new Date() },
      },
    });
  }

  static async findSessionById(id: string): Promise<Session | null> {
    return prisma.session.findUnique({ where: { id } });
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
        return notFoundError("Session");
      }
      return unknownError("revoke session", error);
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
        return notFoundError("Session");
      }

      return { success: true, data: {} as Session };
    } catch (error) {
      return unknownError("revoke session", error);
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
      return unknownError("revoke sessions", error);
    }
  }

  static async deleteExpiredSessions(): Promise<{ count: number }> {
    const result = await prisma.session.deleteMany({
      where: {
        OR: [{ expireAt: { lt: new Date() } }, { isRevoked: true }],
      },
    });
    return { count: result.count };
  }

  static async getActiveSessionsForUser(userId: string): Promise<Session[]> {
    return prisma.session.findMany({
      where: {
        userId,
        isRevoked: false,
        expireAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
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

  static async revokeOldestSession(userId: string): Promise<void> {
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
    }
  }
}
