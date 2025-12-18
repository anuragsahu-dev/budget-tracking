"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const subscription_service_1 = require("./subscription.service");
const apiResponse_1 = require("../../utils/apiResponse");
exports.SubscriptionController = {
    getSubscription: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const subscription = await subscription_service_1.SubscriptionService.getSubscription(userId);
        if (!subscription) {
            return (0, apiResponse_1.sendApiResponse)(res, 200, "No active subscription", {
                hasSubscription: false,
            });
        }
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Subscription fetched", {
            hasSubscription: true,
            ...subscription,
        });
    }),
    getSubscriptionDetails: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const details = await subscription_service_1.SubscriptionService.getSubscriptionWithHistory(userId);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Subscription details fetched", details);
    }),
    cancelSubscription: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const result = await subscription_service_1.SubscriptionService.cancelSubscription(userId);
        return (0, apiResponse_1.sendApiResponse)(res, 200, result.message, {
            expiresAt: result.expiresAt,
        });
    }),
};
