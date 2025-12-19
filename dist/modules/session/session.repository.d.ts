import { Session } from "../../generated/prisma/client";
import { RepositoryResult } from "../../utils/repository.utils";
export declare class SessionRepository {
    static createSession(data: {
        userId: string;
        refreshTokenHash: string;
        expireAt: Date;
    }): Promise<RepositoryResult<Session>>;
    static findActiveSessionByTokenHash(refreshTokenHash: string): Promise<Session | null>;
    static findSessionById(id: string): Promise<Session | null>;
    static revokeSession(id: string): Promise<RepositoryResult<Session>>;
    static revokeSessionByTokenHash(refreshTokenHash: string): Promise<RepositoryResult<Session>>;
    static revokeAllUserSessions(userId: string): Promise<RepositoryResult<{
        count: number;
    }>>;
    static deleteExpiredSessions(): Promise<{
        count: number;
    }>;
    static getActiveSessionsForUser(userId: string): Promise<Session[]>;
    static countActiveSessions(userId: string): Promise<number>;
    static revokeOldestSession(userId: string): Promise<void>;
}
