"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmAvatarUploadSchema = exports.getAvatarUploadUrlSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("../../validations/common.schema");
exports.updateProfileSchema = zod_1.z.object({
    fullName: common_schema_1.fullNameSchema,
});
exports.getAvatarUploadUrlSchema = zod_1.z.object({
    mime: zod_1.z.enum(["jpeg", "jpg", "png", "webp"], {
        error: "Invalid image type. Allowed: jpeg, jpg, png, webp",
    }),
});
exports.confirmAvatarUploadSchema = zod_1.z.object({
    avatarId: zod_1.z.string().min(1, "Avatar ID is required"),
    avatarUrl: zod_1.z.string().url("Invalid avatar URL"),
});
