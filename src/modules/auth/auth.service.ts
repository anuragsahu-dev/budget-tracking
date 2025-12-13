import { otpService } from "../otp/otp.service";
import { ApiError } from "../../middlewares/error.middleware";
import type { EmailInput, VerifyInput } from "./auth.validation";
import { UserRepository } from "../user/user.repository";

export class AuthService {
  static async start(data: EmailInput) {
    let user = await UserRepository.findUserByEmail(data.email);

    if (!user) {
      const result = await UserRepository.createUser({
        email: data.email,
        role: "USER",
      });

      if (!result.success) {
        if (result.error === "DUPLICATE") {
          throw new ApiError(409, result.message, result.error);
        }
        throw new ApiError(500, result.message, result.error);
      }

      user = result.data;
    }

    const otp = await otpService.otpForRegisterOrLogin(user.id, user.email);
    return otp;
  }

  static async verify(data: VerifyInput) {
    const user = await UserRepository.findUserByEmail(data.email);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await otpService.verifyOtp(user.id, data.email, data.otp);

    const updateResult = await UserRepository.updateUser(user.id, {
      isEmailVerified: true,
    });

    if (!updateResult.success) {
      if (updateResult.error === "NOT_FOUND") {
        throw new ApiError(404, updateResult.message);
      }
      throw new ApiError(500, updateResult.message);
    }

    const updatedUser = updateResult.data;

    const responseData = {
      id: user.id,
      email: user.email,
      isEmailVerified: updatedUser.isEmailVerified,
      role: user.role,
      fullName: user.fullName,
    };

    return { message: "Email verified successfully", data: responseData };
  }
}
