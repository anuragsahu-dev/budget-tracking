"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const s3_1 = require("../../config/s3");
const logger_1 = __importDefault(require("../../config/logger"));
const middlewares_1 = require("../../middlewares");
const PRESIGNED_URL_EXPIRY = 3600;
class S3Service {
    static async generateUploadUrl(mime) {
        const avatarId = `avatars/${(0, uuid_1.v4)()}.${mime}`;
        try {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: s3_1.S3_BUCKET_NAME,
                Key: avatarId,
                ContentType: `image/${mime}`,
            });
            const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3_1.s3Client, command, {
                expiresIn: PRESIGNED_URL_EXPIRY,
            });
            const avatarUrl = `https://${s3_1.S3_BUCKET_NAME}.s3.amazonaws.com/${avatarId}`;
            return { uploadUrl, avatarId, avatarUrl };
        }
        catch (error) {
            logger_1.default.error("Failed to generate pre-signed URL", { avatarId, error });
            throw new middlewares_1.ApiError(500, "Failed to generate pre-signed URL");
        }
    }
    static async deleteAvatar(avatarId) {
        try {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: s3_1.S3_BUCKET_NAME,
                Key: avatarId,
            });
            await s3_1.s3Client.send(command);
            logger_1.default.info("Avatar deleted from S3", { avatarId });
        }
        catch (error) {
            logger_1.default.error("Failed to delete avatar from S3", { avatarId, error });
        }
    }
}
exports.S3Service = S3Service;
