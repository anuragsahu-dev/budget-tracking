import { UserRepository } from "./user.repository";
import { SessionRepository } from "../session/session.repository";
import { ApiError } from "../../middlewares/error.middleware";
import type {
  UpdateProfileInput,
  ConfirmAvatarUploadInput,
} from "./user.validation";
import { S3Service } from "../../infrastructure/storage/s3.service";
import {
  DEFAULT_AVATAR_ID,
  DEFAULT_AVATAR_URL,
} from "../../constants/avatar.constants";
import logger from "../../config/logger";

export class UserService {
  static async getProfile(userId: string) {
    const user = await UserRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isEmailVerified: user.isEmailVerified,
      hasGoogleAuth: !!user.googleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await UserRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const result = await UserRepository.updateUser(userId, {
      fullName: data.fullName,
    });

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    const updatedUser = result.data;

    logger.info("User profile updated", { userId });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      role: updatedUser.role,
      isEmailVerified: updatedUser.isEmailVerified,
      updatedAt: updatedUser.updatedAt,
    };
  }

  /**
   * Generate a pre-signed URL for avatar upload
   */
  static async getAvatarUploadUrl(mimeType: string) {
    return S3Service.generateUploadUrl(mimeType);
  }

  /**
   * Confirm avatar upload and update the user's avatar in the database
   */
  static async confirmAvatarUpload(
    userId: string,
    data: ConfirmAvatarUploadInput
  ) {
    const user = await UserRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Delete old avatar from S3 if it exists and is not the default
    if (user.avatarId && user.avatarId !== DEFAULT_AVATAR_ID) {
      logger.info("Replacing existing avatar", {
        userId,
        oldAvatarId: user.avatarId,
      });
      await S3Service.deleteAvatar(user.avatarId);
    }

    // Update user with new avatar
    const result = await UserRepository.updateUser(userId, {
      avatarUrl: data.avatarUrl,
      avatarId: data.avatarId,
    });

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("User avatar updated", { userId, avatarId: data.avatarId });

    return {
      avatarUrl: result.data.avatarUrl,
    };
  }

  /**
   * Delete user's avatar and reset to default
   */
  static async deleteAvatar(userId: string) {
    const user = await UserRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Delete avatar from S3 if it exists
    if (user.avatarId && user.avatarId !== DEFAULT_AVATAR_ID) {
      logger.info("Removing avatar from S3", {
        userId,
        avatarId: user.avatarId,
      });
      await S3Service.deleteAvatar(user.avatarId);
    }

    // Reset to default avatar
    const result = await UserRepository.updateUser(userId, {
      avatarUrl: DEFAULT_AVATAR_URL,
      avatarId: DEFAULT_AVATAR_ID,
    });

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("User avatar deleted", { userId });

    return {
      avatarUrl: result.data.avatarUrl,
    };
  }

  /**
   * Deactivate user's own account
   * User can reactivate by contacting support or admin reactivates
   */
  static async deactivateAccount(userId: string) {
    const user = await UserRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Update user status to INACTIVE
    const result = await UserRepository.updateUser(userId, {
      status: "INACTIVE",
    });

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    // Revoke all sessions to log user out everywhere
    await SessionRepository.revokeAllUserSessions(userId);

    logger.info("User account deactivated", { userId });

    return {
      message:
        "Your account has been deactivated. Contact support to reactivate.",
    };
  }
}
