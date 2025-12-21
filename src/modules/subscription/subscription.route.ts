import { Router } from "express";
import { SubscriptionController } from "./subscription.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT);

// Get current subscription
router.get("/", SubscriptionController.getSubscription);

// Get subscription with payment history
router.get("/details", SubscriptionController.getSubscriptionDetails);

// Cancel subscription
router.post("/cancel", SubscriptionController.cancelSubscription);

export default router;
