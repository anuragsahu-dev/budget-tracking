"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("./user.repository");
const error_middleware_1 = require("../../middlewares/error.middleware");
const s3_service_1 = require("../../infrastructure/storage/s3.service");
const avatar_constants_1 = require("../../constants/avatar.constants");
const logger_1 = __importDefault(require("../../config/logger"));
class UserService {
    static async getProfile(userId) {
        const user = await user_repository_1.UserRepository.findUserById(userId);
        if (!user) {
            throw new error_middleware_1.ApiError(404, "User not found");
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
    static async updateProfile(userId, data) {
        const user = await user_repository_1.UserRepository.findUserById(userId);
        if (!user) {
            throw new error_middleware_1.ApiError(404, "User not found");
        }
        const result = await user_repository_1.UserRepository.updateUser(userId, {
            fullName: data.fullName,
        });
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
        const updatedUser = result.data;
        logger_1.default.info("User profile updated", { userId });
        return {
            id: updatedUser.id,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            role: updatedUser.role,
            isEmailVerified: updatedUser.isEmailVerified,
            updatedAt: updatedUser.updatedAt,
        };
    }
    static async getAvatarUploadUrl(mime) {
        return s3_service_1.S3Service.generateUploadUrl(mime);
    }
    static async confirmAvatarUpload(userId, data) {
        const user = await user_repository_1.UserRepository.findUserById(userId);
        if (!user) {
            throw new error_middleware_1.ApiError(404, "User not found");
        }
        if (user.avatarId && user.avatarId !== avatar_constants_1.DEFAULT_AVATAR_ID) {
            logger_1.default.info("Replacing existing avatar", {
                userId,
                oldAvatarId: user.avatarId,
            });
            await s3_service_1.S3Service.deleteAvatar(user.avatarId);
        }
        const result = await user_repository_1.UserRepository.updateUser(userId, {
            avatarUrl: data.avatarUrl,
            avatarId: data.avatarId,
        });
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
        logger_1.default.info("User avatar updated", { userId, avatarId: data.avatarId });
        return {
            avatarUrl: result.data.avatarUrl,
        };
    }
    static async deleteAvatar(userId) {
        const user = await user_repository_1.UserRepository.findUserById(userId);
        if (!user) {
            throw new error_middleware_1.ApiError(404, "User not found");
        }
        if (user.avatarId && user.avatarId !== avatar_constants_1.DEFAULT_AVATAR_ID) {
            logger_1.default.info("Removing avatar from S3", {
                userId,
                avatarId: user.avatarId,
            });
            await s3_service_1.S3Service.deleteAvatar(user.avatarId);
        }
        const result = await user_repository_1.UserRepository.updateUser(userId, {
            avatarUrl: avatar_constants_1.DEFAULT_AVATAR_URL,
            avatarId: avatar_constants_1.DEFAULT_AVATAR_ID,
        });
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
        logger_1.default.info("User avatar deleted", { userId });
        return {
            avatarUrl: result.data.avatarUrl,
        };
    }
}
exports.UserService = UserService;
