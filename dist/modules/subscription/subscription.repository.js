"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("../../generated/prisma/client");
const repository_utils_1 = require("../../utils/repository.utils");
class SubscriptionRepository {
    static async findByUserId(userId) {
        return prisma_1.default.subscription.findUnique({
            where: { userId },
        });
    }
    static async createSubscription(data) {
        try {
            const subscription = await prisma_1.default.subscription.create({ data });
            return { success: true, data: subscription };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
                return (0, repository_utils_1.duplicateError)("User already has a subscription");
            }
            return (0, repository_utils_1.unknownError)("Failed to create subscription", error);
        }
    }
    static async updateSubscription(userId, data) {
        try {
            const subscription = await prisma_1.default.subscription.update({
                where: { userId },
                data,
            });
            return { success: true, data: subscription };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                return (0, repository_utils_1.notFoundError)("Subscription not found");
            }
            return (0, repository_utils_1.unknownError)("Failed to update subscription", error);
        }
    }
    static async activateSubscription(userId, plan, expiresAt) {
        try {
            const subscription = await prisma_1.default.subscription.upsert({
                where: { userId },
                create: {
                    userId,
                    plan,
                    status: client_1.SubscriptionStatus.ACTIVE,
                    expiresAt,
                },
                update: {
                    plan,
                    status: client_1.SubscriptionStatus.ACTIVE,
                    expiresAt,
                },
            });
            return { success: true, data: subscription };
        }
        catch (error) {
            return (0, repository_utils_1.unknownError)("Failed to activate subscription", error);
        }
    }
    static async markExpiredSubscriptions() {
        const result = await prisma_1.default.subscription.updateMany({
            where: {
                status: client_1.SubscriptionStatus.ACTIVE,
                expiresAt: { lt: new Date() },
            },
            data: {
                status: client_1.SubscriptionStatus.EXPIRED,
            },
        });
        return result.count;
    }
    static async cancelSubscription(userId) {
        try {
            const subscription = await prisma_1.default.subscription.update({
                where: { userId },
                data: { status: client_1.SubscriptionStatus.CANCELLED },
            });
            return { success: true, data: subscription };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                return (0, repository_utils_1.notFoundError)("Subscription not found");
            }
            return (0, repository_utils_1.unknownError)("Failed to cancel subscription", error);
        }
    }
    static async findWithPayments(userId) {
        return prisma_1.default.subscription.findUnique({
            where: { userId },
            include: {
                payments: {
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
            },
        });
    }
}
exports.SubscriptionRepository = SubscriptionRepository;
