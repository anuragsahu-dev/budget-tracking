import { Router } from "express";
import { SubscriptionController } from "./subscription.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";

const router = Router();

// Get current subscription
router.get("/", verifyJWT, SubscriptionController.getSubscription);

// Get subscription with payment history
router.get(
  "/details",
  verifyJWT,
  SubscriptionController.getSubscriptionDetails
);

// Cancel subscription
router.post("/cancel", verifyJWT, SubscriptionController.cancelSubscription);

export default router;
