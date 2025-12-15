import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { PaymentController } from "./payment.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { createOrderSchema, verifyPaymentSchema } from "./payment.validation";

const router = Router();

// Create payment order (requires auth)
router.post(
  "/create-order",
  verifyJWT,
  validate({ body: createOrderSchema }),
  PaymentController.createOrder
);

// Verify payment after Razorpay callback (requires auth)
router.post(
  "/verify",
  verifyJWT,
  validate({ body: verifyPaymentSchema }),
  PaymentController.verifyPayment
);

// Get payment history (requires auth)
router.get("/history", verifyJWT, PaymentController.getPaymentHistory);

// Razorpay webhook (no auth - verified by signature)
router.post("/webhook", PaymentController.handleWebhook);

export default router;
