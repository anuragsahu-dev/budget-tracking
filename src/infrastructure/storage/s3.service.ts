import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { s3Client, S3_BUCKET_NAME } from "../../config/s3";
import logger from "../../config/logger";
import { ApiError } from "../../middlewares";

// Pre-signed URL expiry time (1 hour)
const PRESIGNED_URL_EXPIRY = 3600;

interface PresignedUrlResult {
  uploadUrl: string;
  avatarId: string;
  avatarUrl: string;
}

export type { PresignedUrlResult };

export class S3Service {
  static async generateUploadUrl(mime: string): Promise<PresignedUrlResult> {
    const avatarId = `avatars/${uuidv4()}.${mime}`;

    try {
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: avatarId,
        ContentType: `image/${mime}`,
      });

      const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: PRESIGNED_URL_EXPIRY,
      });

      // Construct the public URL for the avatar
      const avatarUrl = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${avatarId}`;

      return { uploadUrl, avatarId, avatarUrl };
    } catch (error) {
      logger.error("Failed to generate pre-signed URL", { avatarId, error });
      throw new ApiError(500, "Failed to generate pre-signed URL");
    }
  }

  static async deleteAvatar(avatarId: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: avatarId,
      });

      await s3Client.send(command);
      logger.info("Avatar deleted from S3", { avatarId });
    } catch (error) {
      // Log but don't throw - avatar deletion failure shouldn't break the flow
      logger.error("Failed to delete avatar from S3", { avatarId, error });
    }
  }
}
