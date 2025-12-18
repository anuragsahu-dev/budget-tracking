"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const admin_controller_1 = require("./admin.controller");
const admin_validation_1 = require("./admin.validation");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyJWT, role_middleware_1.requireAdmin);
router.get("/categories", admin_controller_1.AdminController.getAllSystemCategories);
router.post("/categories", (0, validate_middleware_1.validate)({ body: admin_validation_1.createSystemCategorySchema }), admin_controller_1.AdminController.createSystemCategory);
router.patch("/categories/:id", (0, validate_middleware_1.validate)({
    params: admin_validation_1.systemCategoryIdParamSchema,
    body: admin_validation_1.updateSystemCategorySchema,
}), admin_controller_1.AdminController.updateSystemCategory);
router.delete("/categories/:id", (0, validate_middleware_1.validate)({ params: admin_validation_1.systemCategoryIdParamSchema }), admin_controller_1.AdminController.deleteSystemCategory);
router.get("/users", (0, validate_middleware_1.validate)({ query: admin_validation_1.listUsersQuerySchema }), admin_controller_1.AdminController.getAllUsers);
router.get("/users/:id", (0, validate_middleware_1.validate)({ params: admin_validation_1.userIdParamSchema }), admin_controller_1.AdminController.getUserById);
router.patch("/users/:id/status", (0, validate_middleware_1.validate)({ params: admin_validation_1.userIdParamSchema, body: admin_validation_1.updateUserStatusSchema }), admin_controller_1.AdminController.updateUserStatus);
router.get("/stats", (0, validate_middleware_1.validate)({ query: admin_validation_1.statsQuerySchema }), admin_controller_1.AdminController.getStats);
router.get("/payments", (0, validate_middleware_1.validate)({ query: admin_validation_1.listPaymentsQuerySchema }), admin_controller_1.AdminController.getAllPayments);
router.get("/payments/stats", (0, validate_middleware_1.validate)({ query: admin_validation_1.statsQuerySchema }), admin_controller_1.AdminController.getPaymentStats);
router.get("/payments/:id", (0, validate_middleware_1.validate)({ params: admin_validation_1.paymentIdParamSchema }), admin_controller_1.AdminController.getPaymentById);
router.get("/pricing", admin_controller_1.AdminController.getAllPlanPricing);
router.post("/pricing", (0, validate_middleware_1.validate)({ body: admin_validation_1.createPlanPricingSchema }), admin_controller_1.AdminController.createPlanPricing);
router.patch("/pricing/:id", (0, validate_middleware_1.validate)({
    params: admin_validation_1.planPricingIdParamSchema,
    body: admin_validation_1.updatePlanPricingSchema,
}), admin_controller_1.AdminController.updatePlanPricing);
router.delete("/pricing/:id", (0, validate_middleware_1.validate)({ params: admin_validation_1.planPricingIdParamSchema }), admin_controller_1.AdminController.deletePlanPricing);
exports.default = router;
