import { asyncHandler } from "../../utils/asyncHandler";
import type { Request, Response } from "express";
import { SubscriptionService } from "./subscription.service";
import { sendApiResponse } from "../../utils/apiResponse";
import logger from "../../config/logger";

export const SubscriptionController = {
  /**
   * Get current subscription status
   * GET /api/v1/subscriptions
   */
  getSubscription: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;

    const subscription = await SubscriptionService.getSubscription(userId);

    if (!subscription) {
      return sendApiResponse(res, 200, "No active subscription", {
        hasSubscription: false,
      });
    }

    return sendApiResponse(res, 200, "Subscription fetched", {
      hasSubscription: true,
      ...subscription,
    });
  }),

  /**
   * Get subscription with payment history
   * GET /api/v1/subscriptions/details
   */
  getSubscriptionDetails: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;

    const details = await SubscriptionService.getSubscriptionWithHistory(
      userId
    );

    return sendApiResponse(res, 200, "Subscription details fetched", details);
  }),

  /**
   * Cancel subscription
   * POST /api/v1/subscriptions/cancel
   */
  cancelSubscription: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;

    const result = await SubscriptionService.cancelSubscription(userId);

    logger.info("Subscription cancelled", { userId });

    return sendApiResponse(res, 200, result.message, {
      expiresAt: result.expiresAt,
    });
  }),
};
