"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const subscription_repository_1 = require("./subscription.repository");
const error_middleware_1 = require("../../middlewares/error.middleware");
const client_1 = require("../../generated/prisma/client");
const logger_1 = __importDefault(require("../../config/logger"));
class SubscriptionService {
    static async getSubscription(userId) {
        const subscription = await subscription_repository_1.SubscriptionRepository.findByUserId(userId);
        if (!subscription) {
            return null;
        }
        const now = new Date();
        const isExpired = (subscription.status === client_1.SubscriptionStatus.ACTIVE ||
            subscription.status === client_1.SubscriptionStatus.CANCELLED) &&
            subscription.expiresAt < now;
        if (isExpired && subscription.status !== client_1.SubscriptionStatus.EXPIRED) {
            const result = await subscription_repository_1.SubscriptionRepository.updateSubscription(userId, {
                status: client_1.SubscriptionStatus.EXPIRED,
            });
            if (result.success) {
                subscription.status = client_1.SubscriptionStatus.EXPIRED;
            }
        }
        const hasAccess = this.checkHasAccess(subscription.status, subscription.expiresAt);
        return {
            id: subscription.id,
            plan: subscription.plan,
            status: subscription.status,
            expiresAt: subscription.expiresAt,
            hasAccess,
            daysRemaining: hasAccess
                ? Math.max(0, Math.ceil((subscription.expiresAt.getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)))
                : 0,
            isCancelled: subscription.status === client_1.SubscriptionStatus.CANCELLED,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
        };
    }
    static async getSubscriptionWithHistory(userId) {
        const subscription = await subscription_repository_1.SubscriptionRepository.findWithPayments(userId);
        if (!subscription) {
            return {
                subscription: null,
                payments: [],
            };
        }
        const hasAccess = this.checkHasAccess(subscription.status, subscription.expiresAt);
        return {
            subscription: {
                id: subscription.id,
                plan: subscription.plan,
                status: subscription.status,
                expiresAt: subscription.expiresAt,
                hasAccess,
                isCancelled: subscription.status === client_1.SubscriptionStatus.CANCELLED,
                createdAt: subscription.createdAt,
            },
            payments: subscription.payments.map((payment) => ({
                id: payment.id,
                plan: payment.plan,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                paidAt: payment.paidAt,
                createdAt: payment.createdAt,
            })),
        };
    }
    static async cancelSubscription(userId) {
        const subscription = await subscription_repository_1.SubscriptionRepository.findByUserId(userId);
        if (!subscription) {
            throw new error_middleware_1.ApiError(404, "No subscription found");
        }
        if (subscription.status !== client_1.SubscriptionStatus.ACTIVE) {
            throw new error_middleware_1.ApiError(400, "Subscription is not active");
        }
        const result = await subscription_repository_1.SubscriptionRepository.cancelSubscription(userId);
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
        const daysRemaining = Math.ceil((result.data.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        logger_1.default.info("Subscription cancelled", {
            userId,
            expiresAt: result.data.expiresAt,
            daysRemaining,
        });
        return {
            message: `Subscription cancelled. You will have access for ${daysRemaining} more days until ${result.data.expiresAt.toDateString()}.`,
            expiresAt: result.data.expiresAt,
            daysRemaining,
        };
    }
    static async hasActiveSubscription(userId) {
        const subscription = await subscription_repository_1.SubscriptionRepository.findByUserId(userId);
        if (!subscription) {
            return false;
        }
        return this.checkHasAccess(subscription.status, subscription.expiresAt);
    }
    static checkHasAccess(status, expiresAt) {
        const now = new Date();
        const notExpired = expiresAt > now;
        return ((status === client_1.SubscriptionStatus.ACTIVE ||
            status === client_1.SubscriptionStatus.CANCELLED) &&
            notExpired);
    }
}
exports.SubscriptionService = SubscriptionService;
