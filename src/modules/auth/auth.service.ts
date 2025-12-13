import { otpService } from "../otp/otp.service";
import { ApiError } from "../../middlewares/error.middleware";
import type { EmailInput, VerifyInput, FullNameInput } from "./auth.validation";
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
        throw new ApiError(
          result.statusCode as number,
          result.message as string,
          result.error as string
        );
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
      throw new ApiError(updateResult.statusCode, "failed to verify email");
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

  static async setName(data: FullNameInput, id: string) {
    const user = await UserRepository.findUserById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const updateResult = await UserRepository.updateUser(user.id, {
      fullName: data.fullName,
    });

    if (!updateResult.success) {
      throw new ApiError(updateResult.statusCode, "failed to update name");
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

  static async me(id: string) {
    const user = await UserRepository.findUserById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const responseData = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    return responseData;
  }
  
  static async logout(id: string) {
    const user = await UserRepository.findUserById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
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
