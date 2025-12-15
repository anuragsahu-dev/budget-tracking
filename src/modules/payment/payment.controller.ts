import { asyncHandler } from "../../utils/asyncHandler";
import type { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { sendApiResponse } from "../../utils/apiResponse";
import { getValidatedBody } from "../../types/express";
import type {
  CreateOrderInput,
  VerifyPaymentInput,
} from "./payment.validation";
import { getPaymentProvider } from "../../infrastructure/payment";
import logger from "../../config/logger";

export const PaymentController = {
  /**
   * Create a payment order
   * POST /api/v1/payments/create-order
   */
  createOrder: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const input = getValidatedBody<CreateOrderInput>(req);

    const order = await PaymentService.createOrder(userId, input);

    return sendApiResponse(res, 201, "Order created successfully", order);
  }),

  /**
   * Verify payment after Razorpay callback
   * POST /api/v1/payments/verify
   */
  verifyPayment: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const input = getValidatedBody<VerifyPaymentInput>(req);

    const result = await PaymentService.verifyPayment(userId, input);

    return sendApiResponse(res, 200, "Payment verified successfully", result);
  }),

  /**
   * Get payment history
   * GET /api/v1/payments/history
   */
  getPaymentHistory: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;

    const payments = await PaymentService.getPaymentHistory(userId);

    return sendApiResponse(res, 200, "Payment history fetched", payments);
  }),

  /**
   * Razorpay webhook handler
   * POST /api/v1/payments/webhook
   */
  handleWebhook: asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers["x-razorpay-signature"] as string;

    if (!signature) {
      logger.warn("Webhook received without signature");
      return sendApiResponse(res, 400, "Missing signature");
    }

    const provider = getPaymentProvider();
    const result = await provider.handleWebhook({
      rawBody: JSON.stringify(req.body),
      signature,
    });

    if (!result.success) {
      logger.warn("Webhook verification failed", { error: result.error });
      return sendApiResponse(res, 400, "Invalid webhook");
    }

    // Handle different webhook events
    logger.info("Webhook received", {
      event: result.event,
      paymentId: result.paymentId,
      status: result.status,
    });

    // Note: Most webhook handling is backup for client-side verification
    // Main payment processing happens in verifyPayment endpoint

    return sendApiResponse(res, 200, "Webhook processed");
  }),
};
