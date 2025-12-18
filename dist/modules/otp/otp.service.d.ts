export declare class OtpService {
    private readonly OTP_EXPIRY_MINUTES;
    private readonly OTP_RESEND_LIMIT_SECONDS;
    private getOtpTtlSeconds;
    private getRedisKeys;
    private generateOtp;
    createOtp(userId: string, email: string): Promise<string>;
    resendOtp(userId: string, email: string): Promise<string>;
    verifyOtp(userId: string, email: string, otp: string): Promise<void>;
    private clearRedisKeys;
    clearExistingOtp(userId: string, email: string): Promise<void>;
    otpForRegisterOrLogin(userId: string, email: string): Promise<string>;
}
export declare const otpService: OtpService;
export default otpService;
