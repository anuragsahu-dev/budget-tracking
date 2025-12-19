import { z } from "zod";
export declare const updateProfileSchema: z.ZodObject<{
    fullName: z.ZodString;
}, z.core.$strip>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export declare const getAvatarUploadUrlSchema: z.ZodObject<{
    mime: z.ZodEnum<{
        jpeg: "jpeg";
        jpg: "jpg";
        png: "png";
        webp: "webp";
    }>;
}, z.core.$strip>;
export declare const confirmAvatarUploadSchema: z.ZodObject<{
    avatarId: z.ZodString;
    avatarUrl: z.ZodString;
}, z.core.$strip>;
export type GetAvatarUploadUrlInput = z.infer<typeof getAvatarUploadUrlSchema>;
export type ConfirmAvatarUploadInput = z.infer<typeof confirmAvatarUploadSchema>;
