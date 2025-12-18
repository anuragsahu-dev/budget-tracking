"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const otp_service_1 = require("../otp/otp.service");
const error_middleware_1 = require("../../middlewares/error.middleware");
const user_repository_1 = require("../user/user.repository");
const jobs_1 = require("../../jobs");
const client_1 = require("../../generated/prisma/client");
const logger_1 = __importDefault(require("../../config/logger"));
class AuthService {
    static async start(data) {
        let user = await user_repository_1.UserRepository.findUserByEmail(data.email);
        let isNewUser = false;
        if (!user) {
            const result = await user_repository_1.UserRepository.createUser({
                email: data.email,
                role: client_1.UserRole.USER,
            });
            if (!result.success) {
                throw new error_middleware_1.ApiError(result.statusCode, result.message);
            }
            user = result.data;
            isNewUser = true;
            logger_1.default.info("New user registered", {
                userId: user.id,
                email: data.email,
            });
        }
        const otp = await otp_service_1.otpService.otpForRegisterOrLogin(user.id, user.email);
        await (0, jobs_1.queueOtpEmail)(user.email, otp, user.fullName ?? undefined);
        logger_1.default.info("OTP sent for authentication", {
            userId: user.id,
            isNewUser,
        });
        return { message: "OTP sent to your email" };
    }
    static async verify(data) {
        const user = await user_repository_1.UserRepository.findUserByEmail(data.email);
        if (!user) {
            throw new error_middleware_1.ApiError(404, "User not found");
        }
        await otp_service_1.otpService.verifyOtp(user.id, data.email, data.otp);
        const updateResult = await user_repository_1.UserRepository.updateUser(user.id, {
            isEmailVerified: true,
        });
        if (!updateResult.success) {
            throw new error_middleware_1.ApiError(updateResult.statusCode, "failed to verify email");
        }
        const updatedUser = updateResult.data;
        logger_1.default.info("User verified and logged in", {
            userId: user.id,
            isFirstLogin: !user.isEmailVerified,
        });
        const responseData = {
            id: user.id,
            email: user.email,
            isEmailVerified: updatedUser.isEmailVerified,
            role: user.role,
            fullName: user.fullName,
        };
        return { message: "Email verified successfully", data: responseData };
    }
    static async setName(data, id) {
        const user = await user_repository_1.UserRepository.findUserById(id);
        if (!user) {
            throw new error_middleware_1.ApiError(404, "User not found");
        }
        const updateResult = await user_repository_1.UserRepository.updateUser(user.id, {
            fullName: data.fullName,
        });
        if (!updateResult.success) {
            throw new error_middleware_1.ApiError(updateResult.statusCode, "failed to update name");
        }
        const updatedUser = updateResult.data;
        const responseData = {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: updatedUser.fullName,
        };
        return responseData;
    }
    static async me(id) {
        const user = await user_repository_1.UserRepository.findUserById(id);
        if (!user) {
            throw new error_middleware_1.ApiError(404, "User not found");
        }
        const responseData = {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
        };
        return responseData;
    }
}
exports.AuthService = AuthService;
