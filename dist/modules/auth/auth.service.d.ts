import type { EmailInput, VerifyInput, FullNameInput } from "./auth.validation";
import { UserRole } from "../../generated/prisma/client";
export declare class AuthService {
    static start(data: EmailInput): Promise<{
        message: string;
    }>;
    static verify(data: VerifyInput): Promise<{
        message: string;
        data: {
            id: string;
            email: string;
            isEmailVerified: boolean;
            role: UserRole;
            fullName: string | null;
        };
    }>;
    static setName(data: FullNameInput, id: string): Promise<{
        id: string;
        email: string;
        role: UserRole;
        fullName: string | null;
    }>;
    static me(id: string): Promise<{
        id: string;
        email: string;
        role: UserRole;
        fullName: string | null;
    }>;
}
