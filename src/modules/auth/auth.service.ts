import { StartInput } from "./auth.types";
import { AuthRepository } from "./auth.repository";
import { otpService } from "../otp/otp.service";

export class AuthService {
    static async start(data: StartInput) {
        let user = await AuthRepository.findUserByEmail(data.email);

        if (!user) {
            user = await AuthRepository.createUserWithEmail(data.email);
        }

        const otp = await otpService.otpForRegisterOrLogin(user.id, user.email);
        return otp;
    }
}