import type { UpdateProfileInput, ConfirmAvatarUploadInput } from "./user.validation";
export declare class UserService {
    static getProfile(userId: string): Promise<{
        id: string;
        email: string;
        fullName: string | null;
        role: import("../../generated/prisma/enums").UserRole;
        avatarUrl: string | null;
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
    static getAvatarUploadUrl(mime: string): Promise<import("../../infrastructure/storage/s3.service").PresignedUrlResult>;
    static confirmAvatarUpload(userId: string, data: ConfirmAvatarUploadInput): Promise<{
        avatarUrl: string | null;
    }>;
    static deleteAvatar(userId: string): Promise<{
        avatarUrl: string | null;
    }>;
}
