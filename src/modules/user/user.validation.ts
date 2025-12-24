import { z } from "zod";
import { fullNameSchema } from "../../validations/common.schema";

export const updateProfileSchema = z.object({
  fullName: fullNameSchema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Avatar validation schemas
export const getAvatarUploadUrlSchema = z.object({
  mimeType: z.enum(["image/jpeg", "image/jpg", "image/png", "image/webp"], {
    error: "Invalid image type. Allowed: jpeg, jpg, png, webp",
  }),
});

export const confirmAvatarUploadSchema = z.object({
  avatarId: z.string().min(1, "Avatar ID is required"),
  avatarUrl: z.url({ message: "Invalid avatar URL" }),
});

export type GetAvatarUploadUrlInput = z.infer<typeof getAvatarUploadUrlSchema>;
export type ConfirmAvatarUploadInput = z.infer<
  typeof confirmAvatarUploadSchema
>;
