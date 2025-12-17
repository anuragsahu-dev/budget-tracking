import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import ms from "ms";
import { config } from "../../config/config";
import { ApiError } from "../../middlewares/error.middleware";
import logger from "../../config/logger";
import { SessionRepository } from "./session.repository";
import type { CookieOptions } from "express";
import type { UserRole } from "../../generated/prisma/client";
import type { TokenPair, DecodedRefreshToken } from "./session.types";

const isProd = config.server.nodeEnv === "production";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
} as const;

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function calculateRefreshTokenExpiry(): Date {
  const expiryMs = ms(config.auth.refreshTokenExpiry);
  return new Date(Date.now() + expiryMs);
}

export class SessionService {
  private static readonly MAX_SESSIONS_PER_USER = 5;

  static async generateTokens(
    userId: string,
    role: UserRole
  ): Promise<TokenPair> {
    const activeCount = await SessionRepository.countActiveSessions(userId);
    if (activeCount >= this.MAX_SESSIONS_PER_USER) {
      await SessionRepository.revokeOldestSession(userId);
      logger.info("Revoked oldest session due to session limit", { userId });
    }

    const refreshToken = jwt.sign(
      { id: userId },
      config.auth.refreshTokenSecret,
      { expiresIn: config.auth.refreshTokenExpiry }
    );

    const refreshTokenHash = hashToken(refreshToken);

    const sessionResult = await SessionRepository.createSession({
      userId,
      refreshTokenHash,
      expireAt: calculateRefreshTokenExpiry(),
    });

    if (!sessionResult.success) {
      throw new ApiError(sessionResult.statusCode, sessionResult.message);
    }

    const accessToken = jwt.sign(
      { id: userId, role },
      config.auth.accessTokenSecret,
      { expiresIn: config.auth.accessTokenExpiry }
    );

    logger.info("Session created successfully", { userId });

    return { accessToken, refreshToken };
  }

  static async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string; userId: string }> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        config.auth.refreshTokenSecret
      ) as DecodedRefreshToken;

      const refreshTokenHash = hashToken(refreshToken);
      const session = await SessionRepository.findActiveSessionByTokenHash(
        refreshTokenHash
      );

      if (!session) {
        throw new ApiError(401, "Invalid or expired refresh token");
      }

      const accessToken = jwt.sign(
        { id: decoded.id },
        config.auth.accessTokenSecret,
        { expiresIn: config.auth.accessTokenExpiry }
      );

      return { accessToken, userId: decoded.id };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        logger.warn("Refresh token expired", { error: "TOKEN_EXPIRED" });
      } else if (error instanceof jwt.JsonWebTokenError) {
        logger.warn("Invalid refresh token", { error: "INVALID_TOKEN" });
      } else if (error instanceof ApiError) {
        throw error;
      } else {
        logger.error("Error refreshing access token", { error });
      }

      throw new ApiError(401, "Authentication failed. Please log in again.");
    }
  }

  /**
   * Logout by revoking the session associated with the refresh token.
   * Returns info about whether revocation succeeded - caller decides how to handle.
   */
  static async logout(
    refreshToken: string
  ): Promise<{ revoked: boolean; reason?: string }> {
    const refreshTokenHash = hashToken(refreshToken);
    const result = await SessionRepository.revokeSessionByTokenHash(
      refreshTokenHash
    );

    if (!result.success) {
      logger.warn("Session revocation failed during logout", {
        error: result.error,
        reason: result.message,
      });

      return {
        revoked: false,
        reason: result.message,
      };
    }

    logger.info("Session revoked successfully");
    return { revoked: true };
  }

  static async logoutAll(userId: string): Promise<{ count: number }> {
    const result = await SessionRepository.revokeAllUserSessions(userId);

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("User logged out from all devices", {
      userId,
      sessionsRevoked: result.data.count,
    });

    return result.data;
  }

  static async getActiveSessions(userId: string) {
    const sessions = await SessionRepository.getActiveSessionsForUser(userId);
    return sessions.map((session) => ({
      id: session.id,
      createdAt: session.createdAt,
      expireAt: session.expireAt,
    }));
  }

  static async revokeSession(sessionId: string, userId: string): Promise<void> {
    const session = await SessionRepository.findSessionById(sessionId);

    if (!session) {
      throw new ApiError(404, "Session not found");
    }

    // Authorization check - user can only revoke their own sessions
    if (session.userId !== userId) {
      throw new ApiError(403, "Not authorized to revoke this session");
    }

    const result = await SessionRepository.revokeSession(sessionId);

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }
  }
}

export const generateAccessRefreshToken = SessionService.generateTokens;
