import { Router } from "express";
import { SubscriptionController } from "./subscription.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT);

/**
 * @swagger
 * /subscriptions:
 *   get:
 *     summary: Get current subscription
 *     tags: [Subscriptions]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription fetched (null if none)
 *       401:
 *         description: Authentication required
 */
router.get("/", SubscriptionController.getSubscription);

/**
 * @swagger
 * /subscriptions/details:
 *   get:
 *     summary: Get subscription with payment history
 *     tags: [Subscriptions]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription details with payments
 *       401:
 *         description: Authentication required
 */
router.get("/details", SubscriptionController.getSubscriptionDetails);

/**
 * @swagger
 * /subscriptions/cancel:
 *   post:
 *     summary: Cancel subscription
 *     tags: [Subscriptions]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     description: Subscription remains active until expiry date
 *     responses:
 *       200:
 *         description: Subscription cancelled
 *       401:
 *         description: Authentication required
 *       404:
 *         description: No active subscription
 */
router.post("/cancel", SubscriptionController.cancelSubscription);

export default router;
