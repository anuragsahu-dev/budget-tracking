import type { CookieOptions } from "express";
import type { UserRole } from "../../generated/prisma/client";
import type { TokenPair } from "./session.types";
export declare const cookieOptions: CookieOptions;
export declare class SessionService {
    private static readonly MAX_SESSIONS_PER_USER;
    static generateTokens(userId: string, role: UserRole): Promise<TokenPair>;
    static refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
        userId: string;
    }>;
    static logout(refreshToken: string): Promise<{
        revoked: boolean;
        reason?: string;
    }>;
    static logoutAll(userId: string): Promise<{
        count: number;
    }>;
    static getActiveSessions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        expireAt: Date;
    }[]>;
    static revokeSession(sessionId: string, userId: string): Promise<void>;
}
export declare const generateAccessRefreshToken: typeof SessionService.generateTokens;
