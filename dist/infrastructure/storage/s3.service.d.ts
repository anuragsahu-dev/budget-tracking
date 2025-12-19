interface PresignedUrlResult {
    uploadUrl: string;
    avatarId: string;
    avatarUrl: string;
}
export type { PresignedUrlResult };
export declare class S3Service {
    static generateUploadUrl(mime: string): Promise<PresignedUrlResult>;
    static deleteAvatar(avatarId: string): Promise<void>;
}
