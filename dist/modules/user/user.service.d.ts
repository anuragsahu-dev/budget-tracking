import type { UpdateProfileInput } from "./user.validation";
export declare class UserService {
    static getProfile(userId: string): Promise<{
        id: string;
        email: string;
        fullName: string | null;
        role: import("../../generated/prisma/enums").UserRole;
        isEmailVerified: boolean;
        hasGoogleAuth: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static updateProfile(userId: string, data: UpdateProfileInput): Promise<{
        id: string;
        email: string;
        fullName: string | null;
        role: import("../../generated/prisma/enums").UserRole;
        isEmailVerified: boolean;
        updatedAt: Date;
    }>;
}
