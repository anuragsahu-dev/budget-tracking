"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const repository_utils_1 = require("../../utils/repository.utils");
class SessionRepository {
    static async createSession(data) {
        try {
            const session = await prisma_1.default.session.create({ data });
            return { success: true, data: session };
        }
        catch (error) {
            return (0, repository_utils_1.unknownError)("Failed to create session", error);
        }
    }
    static async findActiveSessionByTokenHash(refreshTokenHash) {
        return prisma_1.default.session.findFirst({
            where: {
                refreshTokenHash,
                isRevoked: false,
                expireAt: { gt: new Date() },
            },
        });
    }
    static async findSessionById(id) {
        return prisma_1.default.session.findUnique({ where: { id } });
    }
    static async revokeSession(id) {
        try {
            const session = await prisma_1.default.session.update({
                where: { id },
                data: { isRevoked: true },
            });
            return { success: true, data: session };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                return (0, repository_utils_1.notFoundError)("Session not found");
            }
            return (0, repository_utils_1.unknownError)("Failed to revoke session", error);
        }
    }
    static async revokeSessionByTokenHash(refreshTokenHash) {
        try {
            const result = await prisma_1.default.session.updateMany({
                where: { refreshTokenHash },
                data: { isRevoked: true },
            });
            if (result.count === 0) {
                return (0, repository_utils_1.notFoundError)("Session not found or already revoked");
            }
            return { success: true, data: {} };
        }
        catch (error) {
            return (0, repository_utils_1.unknownError)("Failed to revoke session", error);
        }
    }
    static async revokeAllUserSessions(userId) {
        try {
            const result = await prisma_1.default.session.updateMany({
                where: { userId, isRevoked: false },
                data: { isRevoked: true },
            });
            return { success: true, data: { count: result.count } };
        }
        catch (error) {
            return (0, repository_utils_1.unknownError)("Failed to revoke all sessions", error);
        }
    }
    static async deleteExpiredSessions() {
        const result = await prisma_1.default.session.deleteMany({
            where: {
                OR: [{ expireAt: { lt: new Date() } }, { isRevoked: true }],
            },
        });
        return { count: result.count };
    }
    static async getActiveSessionsForUser(userId) {
        return prisma_1.default.session.findMany({
            where: {
                userId,
                isRevoked: false,
                expireAt: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    static async countActiveSessions(userId) {
        return prisma_1.default.session.count({
            where: {
                userId,
                isRevoked: false,
                expireAt: { gt: new Date() },
            },
        });
    }
    static async revokeOldestSession(userId) {
        const oldestSession = await prisma_1.default.session.findFirst({
            where: {
                userId,
                isRevoked: false,
                expireAt: { gt: new Date() },
            },
            orderBy: { createdAt: "asc" },
            select: { id: true },
        });
        if (oldestSession) {
            await prisma_1.default.session.update({
                where: { id: oldestSession.id },
                data: { isRevoked: true },
            });
        }
    }
}
exports.SessionRepository = SessionRepository;
