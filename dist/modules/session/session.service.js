"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessRefreshToken = exports.SessionService = exports.cookieOptions = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ms_1 = __importDefault(require("ms"));
const config_1 = require("../../config/config");
const error_middleware_1 = require("../../middlewares/error.middleware");
const logger_1 = __importDefault(require("../../config/logger"));
const session_repository_1 = require("./session.repository");
const isProd = config_1.config.server.nodeEnv === "production";
exports.cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
};
function hashToken(token) {
    return node_crypto_1.default.createHash("sha256").update(token).digest("hex");
}
function calculateRefreshTokenExpiry() {
    const expiryMs = (0, ms_1.default)(config_1.config.auth.refreshTokenExpiry);
    return new Date(Date.now() + expiryMs);
}
class SessionService {
    static async generateTokens(userId, role) {
        const activeCount = await session_repository_1.SessionRepository.countActiveSessions(userId);
        if (activeCount >= this.MAX_SESSIONS_PER_USER) {
            await session_repository_1.SessionRepository.revokeOldestSession(userId);
            logger_1.default.info("Revoked oldest session due to session limit", { userId });
        }
        const refreshToken = jsonwebtoken_1.default.sign({ id: userId }, config_1.config.auth.refreshTokenSecret, { expiresIn: config_1.config.auth.refreshTokenExpiry });
        const refreshTokenHash = hashToken(refreshToken);
        const sessionResult = await session_repository_1.SessionRepository.createSession({
            userId,
            refreshTokenHash,
            expireAt: calculateRefreshTokenExpiry(),
        });
        if (!sessionResult.success) {
            throw new error_middleware_1.ApiError(sessionResult.statusCode, sessionResult.message);
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: userId, role }, config_1.config.auth.accessTokenSecret, { expiresIn: config_1.config.auth.accessTokenExpiry });
        logger_1.default.info("Session created successfully", { userId });
        return { accessToken, refreshToken };
    }
    static async refreshAccessToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.config.auth.refreshTokenSecret);
            const refreshTokenHash = hashToken(refreshToken);
            const session = await session_repository_1.SessionRepository.findActiveSessionByTokenHash(refreshTokenHash);
            if (!session) {
                throw new error_middleware_1.ApiError(401, "Invalid or expired refresh token");
            }
            const accessToken = jsonwebtoken_1.default.sign({ id: decoded.id }, config_1.config.auth.accessTokenSecret, { expiresIn: config_1.config.auth.accessTokenExpiry });
            return { accessToken, userId: decoded.id };
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                logger_1.default.warn("Refresh token expired", { error: "TOKEN_EXPIRED" });
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                logger_1.default.warn("Invalid refresh token", { error: "INVALID_TOKEN" });
            }
            else if (error instanceof error_middleware_1.ApiError) {
                throw error;
            }
            else {
                logger_1.default.error("Error refreshing access token", { error });
            }
            throw new error_middleware_1.ApiError(401, "Authentication failed. Please log in again.");
        }
    }
    static async logout(refreshToken) {
        const refreshTokenHash = hashToken(refreshToken);
        const result = await session_repository_1.SessionRepository.revokeSessionByTokenHash(refreshTokenHash);
        if (!result.success) {
            logger_1.default.warn("Session revocation failed during logout", {
                error: result.error,
                reason: result.message,
            });
            return {
                revoked: false,
                reason: result.message,
            };
        }
        logger_1.default.info("Session revoked successfully");
        return { revoked: true };
    }
    static async logoutAll(userId) {
        const result = await session_repository_1.SessionRepository.revokeAllUserSessions(userId);
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
        logger_1.default.info("User logged out from all devices", {
            userId,
            sessionsRevoked: result.data.count,
        });
        return result.data;
    }
    static async getActiveSessions(userId) {
        const sessions = await session_repository_1.SessionRepository.getActiveSessionsForUser(userId);
        return sessions.map((session) => ({
            id: session.id,
            createdAt: session.createdAt,
            expireAt: session.expireAt,
        }));
    }
    static async revokeSession(sessionId, userId) {
        const session = await session_repository_1.SessionRepository.findSessionById(sessionId);
        if (!session) {
            throw new error_middleware_1.ApiError(404, "Session not found");
        }
        if (session.userId !== userId) {
            throw new error_middleware_1.ApiError(403, "Not authorized to revoke this session");
        }
        const result = await session_repository_1.SessionRepository.revokeSession(sessionId);
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
    }
}
exports.SessionService = SessionService;
SessionService.MAX_SESSIONS_PER_USER = 5;
exports.generateAccessRefreshToken = SessionService.generateTokens;
