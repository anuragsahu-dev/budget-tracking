"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const repository_utils_1 = require("../../utils/repository.utils");
class UserRepository {
    static async findUserByEmail(email) {
        return prisma_1.default.user.findUnique({ where: { email } });
    }
    static async findUserById(id) {
        return prisma_1.default.user.findUnique({ where: { id } });
    }
    static async createUser(data) {
        try {
            const user = await prisma_1.default.user.create({ data });
            return { success: true, data: user };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
                return (0, repository_utils_1.duplicateError)("User with this email already exists");
            }
            return (0, repository_utils_1.unknownError)("Failed to create user", error);
        }
    }
    static async updateUser(id, data) {
        try {
            const user = await prisma_1.default.user.update({ where: { id }, data });
            return { success: true, data: user };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error)) {
                if (error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                    return (0, repository_utils_1.notFoundError)("User not found");
                }
                if (error.code === repository_utils_1.PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
                    return (0, repository_utils_1.duplicateError)("Email already in use");
                }
            }
            return (0, repository_utils_1.unknownError)("Failed to update user", error);
        }
    }
    static async deleteUser(id) {
        try {
            const user = await prisma_1.default.user.delete({ where: { id } });
            return { success: true, data: user };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                return (0, repository_utils_1.notFoundError)("User not found");
            }
            return (0, repository_utils_1.unknownError)("Failed to delete user", error);
        }
    }
}
exports.UserRepository = UserRepository;
