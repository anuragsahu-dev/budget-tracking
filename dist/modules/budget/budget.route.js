"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const budget_controller_1 = require("./budget.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const budget_validation_1 = require("./budget.validation");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.verifyJWT, (0, validate_middleware_1.validate)({ query: budget_validation_1.listBudgetsQuerySchema }), budget_controller_1.BudgetController.getAllBudgets);
router.get("/:id", auth_middleware_1.verifyJWT, (0, validate_middleware_1.validate)({ params: budget_validation_1.budgetIdParamSchema }), budget_controller_1.BudgetController.getBudgetById);
router.post("/", auth_middleware_1.verifyJWT, (0, validate_middleware_1.validate)({ body: budget_validation_1.createBudgetSchema }), budget_controller_1.BudgetController.createBudget);
router.patch("/:id", auth_middleware_1.verifyJWT, (0, validate_middleware_1.validate)({ params: budget_validation_1.budgetIdParamSchema, body: budget_validation_1.updateBudgetSchema }), budget_controller_1.BudgetController.updateBudget);
router.delete("/:id", auth_middleware_1.verifyJWT, (0, validate_middleware_1.validate)({ params: budget_validation_1.budgetIdParamSchema }), budget_controller_1.BudgetController.deleteBudget);
router.post("/:budgetId/allocations", auth_middleware_1.verifyJWT, (0, validate_middleware_1.validate)({
    params: budget_validation_1.budgetAllocationParamsSchema,
    body: budget_validation_1.createAllocationSchema,
}), budget_controller_1.BudgetController.createAllocation);
router.patch("/:budgetId/allocations/:id", auth_middleware_1.verifyJWT, (0, validate_middleware_1.validate)({ params: budget_validation_1.allocationIdParamSchema, body: budget_validation_1.updateAllocationSchema }), budget_controller_1.BudgetController.updateAllocation);
router.delete("/:budgetId/allocations/:id", auth_middleware_1.verifyJWT, (0, validate_middleware_1.validate)({ params: budget_validation_1.allocationIdParamSchema }), budget_controller_1.BudgetController.deleteAllocation);
exports.default = router;
