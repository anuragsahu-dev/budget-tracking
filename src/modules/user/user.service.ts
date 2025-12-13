import { UserRepository } from "./user.repository";
import { ApiError } from "../../middlewares/error.middleware";
import type { UpdateProfileInput } from "./user.validation";
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
}
