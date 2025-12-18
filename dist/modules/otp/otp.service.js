"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpService = exports.OtpService = void 0;
const node_crypto_1 = require("node:crypto");
const argon2_1 = __importDefault(require("argon2"));
const redis_service_1 = __importDefault(require("../../infrastructure/cache/redis.service"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const error_middleware_1 = require("../../middlewares/error.middleware");
const logger_1 = __importDefault(require("../../config/logger"));
class OtpService {
    constructor() {
        this.OTP_EXPIRY_MINUTES = 5;
        this.OTP_RESEND_LIMIT_SECONDS = 30;
    }
    getOtpTtlSeconds() {
        return this.OTP_EXPIRY_MINUTES * 60;
    }
    getRedisKeys(userId, email) {
        const base = `${userId}:${email}`;
        return {
            otpKey: `otp:${base}`,
            throttleKey: `otp:throttle:${base}`,
        };
    }
    generateOtp() {
        return (0, node_crypto_1.randomInt)(100000, 999999).toString();
    }
    async createOtp(userId, email) {
        const { otpKey, throttleKey } = this.getRedisKeys(userId, email);
        const throttled = await redis_service_1.default.get(throttleKey);
        if (throttled) {
            logger_1.default.warn("OTP throttled - too many requests", { userId, email });
            throw new error_middleware_1.ApiError(429, "Please wait before requesting another OTP");
        }
        const otp = this.generateOtp();
        const otpHash = await argon2_1.default.hash(otp);
        const expiresAt = new Date(Date.now() + this.getOtpTtlSeconds() * 1000);
        await redis_service_1.default.set(otpKey, otpHash, this.getOtpTtlSeconds());
        await redis_service_1.default.set(throttleKey, "1", this.OTP_RESEND_LIMIT_SECONDS);
        await prisma_1.default.otp.create({
            data: {
                userId,
                email,
                otpHash,
                expiresAt,
            },
        });
        logger_1.default.info(`OTP created for user ${userId}`);
        return otp;
    }
    async resendOtp(userId, email) {
        await this.clearExistingOtp(userId, email);
        return this.createOtp(userId, email);
    }
    async verifyOtp(userId, email, otp) {
        const { otpKey } = this.getRedisKeys(userId, email);
        let otpHash = await redis_service_1.default.get(otpKey);
        let otpRecordId = null;
        if (!otpHash) {
            const dbRecord = await prisma_1.default.otp.findFirst({
                where: {
                    userId,
                    email,
                    verified: false,
                    expiresAt: { gt: new Date() },
                },
                orderBy: { createdAt: "desc" },
            });
            if (!dbRecord) {
                throw new error_middleware_1.ApiError(400, "OTP expired or invalid");
            }
            otpHash = dbRecord.otpHash;
            otpRecordId = dbRecord.id;
        }
        const isValid = await argon2_1.default.verify(otpHash, otp);
        if (!isValid) {
            logger_1.default.warn("Invalid OTP attempt", { userId, email });
            throw new error_middleware_1.ApiError(400, "Invalid OTP");
        }
        if (otpRecordId) {
            try {
                await prisma_1.default.otp.update({
                    where: { id: otpRecordId },
                    data: { verified: true },
                });
            }
            catch (error) {
                logger_1.default.error(`Failed to mark OTP as verified [${otpRecordId}]`, error);
            }
        }
        await this.clearRedisKeys(userId, email);
        logger_1.default.info(`OTP verified successfully for user ${userId}`);
    }
    async clearRedisKeys(userId, email) {
        const { otpKey, throttleKey } = this.getRedisKeys(userId, email);
        await redis_service_1.default.del(otpKey);
        await redis_service_1.default.del(throttleKey);
    }
    async clearExistingOtp(userId, email) {
        await this.clearRedisKeys(userId, email);
        await prisma_1.default.otp.deleteMany({
            where: { userId, email },
        });
    }
    async otpForRegisterOrLogin(userId, email) {
        await this.clearExistingOtp(userId, email);
        return this.createOtp(userId, email);
    }
}
exports.OtpService = OtpService;
exports.otpService = new OtpService();
exports.default = exports.otpService;
