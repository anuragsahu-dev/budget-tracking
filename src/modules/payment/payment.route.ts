import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { PaymentController } from "./payment.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { createOrderSchema, verifyPaymentSchema } from "./payment.validation";

const router = Router();

/**
 * @swagger
 * /payments/plans:
 *   get:
 *     summary: Get available subscription plans
 *     tags: [Payments]
 *     description: Public endpoint - no authentication required
 *     responses:
 *       200:
 *         description: Plans fetched successfully
 */
router.get("/plans", PaymentController.getAvailablePlans);

/**
 * @swagger
 * /payments/create-order:
 *   post:
 *     summary: Create a payment order
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan
 *             properties:
 *               plan:
 *                 type: string
 *                 enum: [PRO_MONTHLY, PRO_YEARLY]
 *               currency:
 *                 type: string
 *                 enum: [INR, USD]
 *                 default: INR
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Invalid plan or pricing unavailable
 *       401:
 *         description: Authentication required
 */
router.post(
  "/create-order",
  verifyJWT,
  validate({ body: createOrderSchema }),
  PaymentController.createOrder
);

/**
 * @swagger
 * /payments/verify:
 *   post:
 *     summary: Verify payment after Razorpay callback
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razorpay_order_id
 *               - razorpay_payment_id
 *               - razorpay_signature
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *               razorpay_payment_id:
 *                 type: string
 *               razorpay_signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified and subscription activated
 *       400:
 *         description: Invalid signature or already processed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Payment does not belong to user
 *       404:
 *         description: Payment not found
 */
router.post(
  "/verify",
  verifyJWT,
  validate({ body: verifyPaymentSchema }),
  PaymentController.verifyPayment
);

/**
 * @swagger
 * /payments/history:
 *   get:
 *     summary: Get payment history
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history fetched
 *       401:
 *         description: Authentication required
 */
router.get("/history", verifyJWT, PaymentController.getPaymentHistory);

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Razorpay webhook handler
 *     tags: [Payments]
 *     description: Called by Razorpay. Verified by signature, no auth needed.
 *     responses:
 *       200:
 *         description: Webhook processed
 *       400:
 *         description: Invalid signature
 */
router.post("/webhook", PaymentController.handleWebhook);

export default router;
