import prisma from "../../config/prisma";
import { Session } from "../../generated/prisma/client";
import logger from "../../config/logger";

const PRISMA_ERROR = {
  RECORD_NOT_FOUND: "P2025",
  UNIQUE_CONSTRAINT_VIOLATION: "P2002",
} as const;

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

type SuccessResult<T> = {
  success: true;
  data: T;
};

type ErrorResult = {
  success: false;
  error: "NOT_FOUND" | "UNKNOWN";
  statusCode: number;
  message: string;
};

type RepositoryResult<T> = SuccessResult<T> | ErrorResult;

export class SessionRepository {
  static async createSession(data: {
    userId: string;
    refreshTokenHash: string;
    expireAt: Date;
  }): Promise<RepositoryResult<Session>> {
    try {
      const session = await prisma.session.create({
        data: {
          userId: data.userId,
          refreshTokenHash: data.refreshTokenHash,
          expireAt: data.expireAt,
        },
      });
      return { success: true, data: session };
    } catch (error) {
      logger.error("SessionRepository.createSession failed", { error });
      return {
        success: false,
        error: "UNKNOWN",
        statusCode: 500,
        message: "Failed to create session",
      };
    }
  }

  /**
   * Find a session by its refresh token hash.
   * Only returns active (non-revoked, non-expired) sessions.
   */
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

  /**
   * Find a session by its ID.
   */
  static async findSessionById(id: string): Promise<Session | null> {
    return prisma.session.findUnique({
      where: { id },
    });
  }

  /**
   * Revoke a specific session by its ID.
   * Used for single-device logout.
   */
  static async revokeSession(id: string): Promise<RepositoryResult<Session>> {
    try {
      const session = await prisma.session.update({
        where: { id },
        data: { isRevoked: true },
      });
      return { success: true, data: session };
    } catch (error) {
      if (isPrismaError(error)) {
        if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
          return {
            success: false,
            error: "NOT_FOUND",
            statusCode: 404,
            message: "Session not found",
          };
        }
      }
      logger.error("SessionRepository.revokeSession failed", { id, error });
      return {
        success: false,
        error: "UNKNOWN",
        statusCode: 500,
        message: "Failed to revoke session",
      };
    }
  }

  /**
   * Revoke a session by its refresh token hash.
   * Used for logout when you have the token but not the session ID.
   */
  static async revokeSessionByTokenHash(
    refreshTokenHash: string
  ): Promise<RepositoryResult<Session>> {
    try {
      const session = await prisma.session.updateMany({
        where: { refreshTokenHash },
        data: { isRevoked: true },
      });

      if (session.count === 0) {
        return {
          success: false,
          error: "NOT_FOUND",
          statusCode: 404,
          message: "Session not found",
        };
      }

      // Return a partial success (updateMany doesn't return the record)
      return { success: true, data: {} as Session };
    } catch (error) {
      logger.error("SessionRepository.revokeSessionByTokenHash failed", {
        error,
      });
      return {
        success: false,
        error: "UNKNOWN",
        statusCode: 500,
        message: "Failed to revoke session",
      };
    }
  }

  /**
   * Revoke all sessions for a user.
   * Used for "logout from all devices" feature.
   */
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
      logger.error("SessionRepository.revokeAllUserSessions failed", {
        userId,
        error,
      });
      return {
        success: false,
        error: "UNKNOWN",
        statusCode: 500,
        message: "Failed to revoke sessions",
      };
    }
  }

  /**
   * Delete expired sessions for cleanup.
   * Can be run as a scheduled job.
   */
  static async deleteExpiredSessions(): Promise<{ count: number }> {
    const result = await prisma.session.deleteMany({
      where: {
        OR: [{ expireAt: { lt: new Date() } }, { isRevoked: true }],
      },
    });
    return { count: result.count };
  }

  /**
   * Get all active sessions for a user.
   * Useful for showing "active devices" in user settings.
   */
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

  /**
   * Count active sessions for a user.
   * Used to enforce session limits.
   */
  static async countActiveSessions(userId: string): Promise<number> {
    return prisma.session.count({
      where: {
        userId,
        isRevoked: false,
        expireAt: { gt: new Date() },
      },
    });
  }

  /**
   * Revoke the oldest active session for a user.
   * Used when session limit is reached.
   */
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
