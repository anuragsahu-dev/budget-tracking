import { randomInt } from "node:crypto";
import argon2 from "argon2";
import redisService from "../../infrastructure/cache/redis.service";
import prisma from "../../config/prisma";
import { ApiError } from "../../middlewares/error.middleware";
import logger from "../../config/logger";

export class OtpService {
  private readonly OTP_EXPIRY_MINUTES = 5;
  private readonly OTP_RESEND_LIMIT_SECONDS = 30;

  private getOtpTtlSeconds(): number {
    return this.OTP_EXPIRY_MINUTES * 60;
  }

  private getRedisKeys(userId: string, email: string) {
    const base = `${userId}:${email}`;
    return {
      otpKey: `otp:${base}`,
      throttleKey: `otp:throttle:${base}`,
    };
  }

  private generateOtp(): string {
    return randomInt(100000, 999999).toString();
  }

  async createOtp(userId: string, email: string): Promise<string> {
    const { otpKey, throttleKey } = this.getRedisKeys(userId, email);

    // Check throttle (prevent spam)
    const throttled = await redisService.get(throttleKey);
    if (throttled) {
      throw new ApiError(429, "Please wait before requesting another OTP");
    }

    const otp = this.generateOtp();
    const otpHash = await argon2.hash(otp);
    const expiresAt = new Date(Date.now() + this.getOtpTtlSeconds() * 1000);

    // Store in Redis (primary) and DB (backup)
    await redisService.set(otpKey, otpHash, this.getOtpTtlSeconds());
    await redisService.set(throttleKey, "1", this.OTP_RESEND_LIMIT_SECONDS);

    await prisma.otp.create({
      data: {
        userId,
        email,
        otpHash,
        expiresAt,
      },
    });

    logger.info(`OTP created for user ${userId}`);
    return otp;
  }

  async resendOtp(userId: string, email: string): Promise<string> {
    await this.clearExistingOtp(userId, email);
    return this.createOtp(userId, email);
  }

  async verifyOtp(userId: string, email: string, otp: string) {
    const { otpKey } = this.getRedisKeys(userId, email);

    // Try Redis first
    let otpHash = await redisService.get<string>(otpKey);
    let otpRecordId: string | null = null;

    // Fallback to DB if Redis miss
    if (!otpHash) {
      const dbRecord = await prisma.otp.findFirst({
        where: {
          userId,
          email,
          verified: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
      });

      if (!dbRecord) {
        throw new ApiError(400, "OTP expired or invalid");
      }

      otpHash = dbRecord.otpHash;
      otpRecordId = dbRecord.id;
    }

    const isValid = await argon2.verify(otpHash, otp);

    if (!isValid) {
      throw new ApiError(400, "Invalid OTP");
    }

    // Mark as verified in DB (for audit trail - non-critical)
    if (otpRecordId) {
      try {
        await prisma.otp.update({
          where: { id: otpRecordId },
          data: { verified: true },
        });
      } catch (error) {
        logger.error(`Failed to mark OTP as verified [${otpRecordId}]`, error);
      }
    }

    // Clear Redis keys
    await this.clearRedisKeys(userId, email);

    logger.info(`OTP verified successfully for user ${userId}`);
  }

  private async clearRedisKeys(userId: string, email: string): Promise<void> {
    const { otpKey, throttleKey } = this.getRedisKeys(userId, email);
    await redisService.del(otpKey);
    await redisService.del(throttleKey);
  }

  async clearExistingOtp(userId: string, email: string): Promise<void> {
    await this.clearRedisKeys(userId, email);

    await prisma.otp.deleteMany({
      where: { userId, email },
    });
  }

  async otpForRegisterOrLogin(userId: string, email: string): Promise<string> {
    await this.clearExistingOtp(userId, email);
    return this.createOtp(userId, email);
  }
}

export const otpService = new OtpService();
export default otpService;
