import { Prisma, User } from "../../generated/prisma/client";
import { RepositoryResult } from "../../utils/repository.utils";
export declare class UserRepository {
    static findUserByEmail(email: string): Promise<User | null>;
    static findUserById(id: string): Promise<User | null>;
    static createUser(data: Prisma.UserCreateInput): Promise<RepositoryResult<User>>;
    static updateUser(id: string, data: Prisma.UserUpdateInput): Promise<RepositoryResult<User>>;
    static deleteUser(id: string): Promise<RepositoryResult<User>>;
}
