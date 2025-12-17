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
  createPlanPricingSchema,
  updatePlanPricingSchema,
  planPricingIdParamSchema,
} from "./admin.validation";

const router = Router();

// All admin routes require authentication and admin role
router.use(verifyJWT, requireAdmin);

// ========== SYSTEM CATEGORY ROUTES ==========

router.get("/categories", AdminController.getAllSystemCategories);

router.post(
  "/categories",
  validate({ body: createSystemCategorySchema }),
  AdminController.createSystemCategory
);

router.patch(
  "/categories/:id",
  validate({
    params: systemCategoryIdParamSchema,
    body: updateSystemCategorySchema,
  }),
  AdminController.updateSystemCategory
);

router.delete(
  "/categories/:id",
  validate({ params: systemCategoryIdParamSchema }),
  AdminController.deleteSystemCategory
);

// ========== USER MANAGEMENT ROUTES ==========

router.get(
  "/users",
  validate({ query: listUsersQuerySchema }),
  AdminController.getAllUsers
);

router.get(
  "/users/:id",
  validate({ params: userIdParamSchema }),
  AdminController.getUserById
);

router.patch(
  "/users/:id/status",
  validate({ params: userIdParamSchema, body: updateUserStatusSchema }),
  AdminController.updateUserStatus
);

// ========== STATISTICS ROUTES ==========

router.get(
  "/stats",
  validate({ query: statsQuerySchema }),
  AdminController.getStats
);

// ========== PAYMENT MANAGEMENT ROUTES ==========

router.get(
  "/payments",
  validate({ query: listPaymentsQuerySchema }),
  AdminController.getAllPayments
);

router.get(
  "/payments/stats",
  validate({ query: statsQuerySchema }),
  AdminController.getPaymentStats
);

router.get(
  "/payments/:id",
  validate({ params: paymentIdParamSchema }),
  AdminController.getPaymentById
);

// ========== PLAN PRICING ROUTES ==========

router.get("/pricing", AdminController.getAllPlanPricing);

router.post(
  "/pricing",
  validate({ body: createPlanPricingSchema }),
  AdminController.createPlanPricing
);

router.patch(
  "/pricing/:id",
  validate({
    params: planPricingIdParamSchema,
    body: updatePlanPricingSchema,
  }),
  AdminController.updatePlanPricing
);

router.delete(
  "/pricing/:id",
  validate({ params: planPricingIdParamSchema }),
  AdminController.deletePlanPricing
);

export default router;
