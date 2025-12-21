import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { verifyJWT } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/role.middleware";
import { AdminController } from "./admin.controller";
import {
  createSystemCategorySchema,
  updateSystemCategorySchema,
  systemCategoryIdParamSchema,
  userIdParamSchema,
  updateUserStatusSchema,
  listUsersQuerySchema,
  statsQuerySchema,
  listPaymentsQuerySchema,
  paymentIdParamSchema,
  updatePaymentSchema,
  createPlanPricingSchema,
  updatePlanPricingSchema,
  planPricingIdParamSchema,
  listSubscriptionsQuerySchema,
  subscriptionIdParamSchema,
  updateSubscriptionSchema,
  createSubscriptionSchema,
} from "./admin.validation";

const router = Router();

// All admin routes require authentication and admin role
router.use(verifyJWT, requireAdmin);

// ========== SYSTEM CATEGORY ROUTES ==========

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     summary: Get all system categories
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System categories fetched
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.get("/categories", AdminController.getAllSystemCategories);

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     summary: Create a system category
 *     tags: [Admin]
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Invalid request body
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Category with this name exists
 */
router.post(
  "/categories",
  validate({ body: createSystemCategorySchema }),
  AdminController.createSystemCategory
);

/**
 * @swagger
 * /admin/categories/{id}:
 *   patch:
 *     summary: Update a system category
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Category not found
 */
router.patch(
  "/categories/:id",
  validate({
    params: systemCategoryIdParamSchema,
    body: updateSystemCategorySchema,
  }),
  AdminController.updateSystemCategory
);

/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     summary: Delete a system category
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category in use
 */
router.delete(
  "/categories/:id",
  validate({ params: systemCategoryIdParamSchema }),
  AdminController.deleteSystemCategory
);

// ========== USER MANAGEMENT ROUTES ==========

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (paginated)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Users fetched
 *       403:
 *         description: Admin access required
 */
router.get(
  "/users",
  validate({ query: listUsersQuerySchema }),
  AdminController.getAllUsers
);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User fetched
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.get(
  "/users/:id",
  validate({ params: userIdParamSchema }),
  AdminController.getUserById
);

/**
 * @swagger
 * /admin/users/{id}/status:
 *   patch:
 *     summary: Update user status
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, SUSPENDED]
 *     responses:
 *       200:
 *         description: Status updated and sessions revoked
 *       403:
 *         description: Cannot change own status
 *       404:
 *         description: User not found
 */
router.patch(
  "/users/:id/status",
  validate({ params: userIdParamSchema, body: updateUserStatusSchema }),
  AdminController.updateUserStatus
);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Permanently delete a user
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     description: Deletes user and all their data. Irreversible.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       403:
 *         description: Cannot delete self or admins
 *       404:
 *         description: User not found
 */
router.delete(
  "/users/:id",
  validate({ params: userIdParamSchema }),
  AdminController.deleteUser
);

// ========== STATISTICS ROUTES ==========

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get platform statistics
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Statistics fetched
 *       403:
 *         description: Admin access required
 */
router.get(
  "/stats",
  validate({ query: statsQuerySchema }),
  AdminController.getStats
);

// ========== PAYMENT MANAGEMENT ROUTES ==========

/**
 * @swagger
 * /admin/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED, FAILED, REFUNDED]
 *       - in: query
 *         name: plan
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payments fetched
 *       403:
 *         description: Admin access required
 */
router.get(
  "/payments",
  validate({ query: listPaymentsQuerySchema }),
  AdminController.getAllPayments
);

/**
 * @swagger
 * /admin/payments/stats:
 *   get:
 *     summary: Get payment statistics
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Payment stats fetched
 *       403:
 *         description: Admin access required
 */
router.get(
  "/payments/stats",
  validate({ query: statsQuerySchema }),
  AdminController.getPaymentStats
);

/**
 * @swagger
 * /admin/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment fetched
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Payment not found
 */
router.get(
  "/payments/:id",
  validate({ params: paymentIdParamSchema }),
  AdminController.getPaymentById
);

/**
 * @swagger
 * /admin/payments/{id}:
 *   patch:
 *     summary: Update payment (manual fix)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               subscriptionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment updated
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Payment not found
 */
router.patch(
  "/payments/:id",
  validate({ params: paymentIdParamSchema, body: updatePaymentSchema }),
  AdminController.updatePayment
);

// ========== PLAN PRICING ROUTES ==========

/**
 * @swagger
 * /admin/pricing:
 *   get:
 *     summary: Get all plan pricing
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pricing plans fetched
 *       403:
 *         description: Admin access required
 */
router.get("/pricing", AdminController.getAllPlanPricing);

/**
 * @swagger
 * /admin/pricing:
 *   post:
 *     summary: Create a pricing plan
 *     tags: [Admin]
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
 *               - currency
 *               - amount
 *               - durationDays
 *               - name
 *             properties:
 *               plan:
 *                 type: string
 *               currency:
 *                 type: string
 *               amount:
 *                 type: number
 *               durationDays:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Pricing created
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Pricing exists for this plan/currency
 */
router.post(
  "/pricing",
  validate({ body: createPlanPricingSchema }),
  AdminController.createPlanPricing
);

/**
 * @swagger
 * /admin/pricing/{id}:
 *   patch:
 *     summary: Update pricing plan
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Pricing updated
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Pricing not found
 */
router.patch(
  "/pricing/:id",
  validate({
    params: planPricingIdParamSchema,
    body: updatePlanPricingSchema,
  }),
  AdminController.updatePlanPricing
);

/**
 * @swagger
 * /admin/pricing/{id}:
 *   delete:
 *     summary: Delete pricing plan
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pricing deleted
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Pricing not found
 */
router.delete(
  "/pricing/:id",
  validate({ params: planPricingIdParamSchema }),
  AdminController.deletePlanPricing
);

// ========== SUBSCRIPTION MANAGEMENT ROUTES ==========

/**
 * @swagger
 * /admin/subscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, CANCELLED, EXPIRED]
 *       - in: query
 *         name: plan
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Subscriptions fetched
 *       403:
 *         description: Admin access required
 */
router.get(
  "/subscriptions",
  validate({ query: listSubscriptionsQuerySchema }),
  AdminController.getAllSubscriptions
);

/**
 * @swagger
 * /admin/subscriptions/stats:
 *   get:
 *     summary: Get subscription statistics
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats fetched
 *       403:
 *         description: Admin access required
 */
router.get("/subscriptions/stats", AdminController.getSubscriptionStats);

/**
 * @swagger
 * /admin/subscriptions/{id}:
 *   get:
 *     summary: Get subscription by ID
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription fetched
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Subscription not found
 */
router.get(
  "/subscriptions/:id",
  validate({ params: subscriptionIdParamSchema }),
  AdminController.getSubscriptionById
);

/**
 * @swagger
 * /admin/subscriptions/{id}:
 *   patch:
 *     summary: Update subscription
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Subscription updated
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Subscription not found
 */
router.patch(
  "/subscriptions/:id",
  validate({
    params: subscriptionIdParamSchema,
    body: updateSubscriptionSchema,
  }),
  AdminController.updateSubscription
);

/**
 * @swagger
 * /admin/subscriptions:
 *   post:
 *     summary: Create subscription (manual)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     description: For manual intervention when payment succeeded but subscription failed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - plan
 *             properties:
 *               userId:
 *                 type: string
 *               plan:
 *                 type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Subscription created
 *       403:
 *         description: Admin access required
 *       409:
 *         description: User already has subscription
 */
router.post(
  "/subscriptions",
  validate({ body: createSubscriptionSchema }),
  AdminController.createSubscription
);

// ========== FORCE LOGOUT ROUTE ==========

/**
 * @swagger
 * /admin/users/{id}/sessions:
 *   delete:
 *     summary: Force logout user
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     description: Revoke all sessions for a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All sessions revoked
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.delete(
  "/users/:id/sessions",
  validate({ params: userIdParamSchema }),
  AdminController.forceLogoutUser
);

export default router;
