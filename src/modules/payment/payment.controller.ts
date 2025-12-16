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
   * Get available plans for purchase
   * GET /api/v1/payments/plans?currency=INR
   */
  getAvailablePlans: asyncHandler(async (req: Request, res: Response) => {
    const { currency = "INR" } = req.query as { currency?: string };

    const plans = await PaymentService.getAvailablePlans(currency);

    return sendApiResponse(res, 200, "Available plans fetched", plans);
  }),

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
   *
   * IMPORTANT: This is the BACKUP mechanism for payment processing.
   * - Razorpay sends webhooks for all payment events
   * - If our /verify endpoint fails, webhook will activate subscription
   * - Razorpay retries webhooks for up to 24 hours if we don't return 200
   *
   * DEVELOPMENT TESTING:
   * - Use ngrok to expose local server: `ngrok http 3000`
   * - Set webhook URL in Razorpay Dashboard to ngrok URL
   * - Or use Razorpay Test Mode with their webhook testing tool
   */
  handleWebhook: asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers["x-razorpay-signature"] as string;

    // Log incoming webhook for debugging
    logger.info("Webhook received", {
      hasSignature: !!signature,
      contentType: req.headers["content-type"],
    });

    if (!signature) {
      logger.warn("Webhook received without signature - rejecting");
      return sendApiResponse(res, 400, "Missing signature");
    }

    // Verify webhook signature
    // Use rawBody preserved by middleware in app.ts for accurate signature verification
    const provider = getPaymentProvider();
    const result = await provider.handleWebhook({
      rawBody: req.rawBody || JSON.stringify(req.body),
      signature,
    });

    if (!result.success) {
      logger.warn("Webhook signature verification failed", {
        error: result.error,
        event: result.event,
      });
      return sendApiResponse(res, 400, "Invalid webhook");
    }

    // Extract event details
    const { paymentId, orderId, status, event } = result;

    logger.info("Webhook verified", { event, paymentId, orderId, status });

    // Process based on status
    if (paymentId && orderId && status) {
      try {
        switch (status) {
          case "completed":
            await PaymentService.handlePaymentCaptured(paymentId, orderId);
            break;

          case "failed": {
            // Extract error description from payload
            const errorDesc = (
              req.body as {
                payload?: {
                  payment?: { entity?: { error_description?: string } };
                };
              }
            ).payload?.payment?.entity?.error_description;
            await PaymentService.handlePaymentFailed(
              paymentId,
              orderId,
              errorDesc
            );
            break;
          }

          case "refunded":
            // Refunds are initiated manually by admin in Razorpay Dashboard
            // Just log it - subscription management is done manually
            logger.info("Webhook: Refund event received", {
              paymentId,
              note: "Admin should manually cancel subscription if needed",
            });
            break;
        }
      } catch (error) {
        // Log error but still return 200 to prevent Razorpay from retrying
        // We'll handle the error manually via logs
        logger.error("Webhook processing error", {
          event,
          paymentId,
          orderId,
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
          action:
            "Webhook acknowledged but processing failed - manual review needed",
        });
      }
    }

    // Always return 200 to acknowledge receipt
    // This tells Razorpay to stop retrying this webhook
    return sendApiResponse(res, 200, "Webhook processed");
  }),
};
