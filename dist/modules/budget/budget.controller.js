"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const budget_service_1 = require("./budget.service");
const apiResponse_1 = require("../../utils/apiResponse");
const express_1 = require("../../types/express");
exports.BudgetController = {
    getAllBudgets: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const query = (0, express_1.getValidatedQuery)(req);
        const result = await budget_service_1.BudgetService.getAllBudgets(userId, query);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Budgets fetched successfully", result.budgets, result.meta);
    }),
    getBudgetById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const { id } = (0, express_1.getValidatedParams)(req);
        const budget = await budget_service_1.BudgetService.getBudgetById(id, userId);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Budget fetched successfully", budget);
    }),
    createBudget: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const data = (0, express_1.getValidatedBody)(req);
        const budget = await budget_service_1.BudgetService.createBudget(userId, data);
        return (0, apiResponse_1.sendApiResponse)(res, 201, "Budget created successfully", budget);
    }),
    updateBudget: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const { id } = (0, express_1.getValidatedParams)(req);
        const data = (0, express_1.getValidatedBody)(req);
        const budget = await budget_service_1.BudgetService.updateBudget(id, userId, data);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Budget updated successfully", budget);
    }),
    deleteBudget: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const { id } = (0, express_1.getValidatedParams)(req);
        const result = await budget_service_1.BudgetService.deleteBudget(id, userId);
        return (0, apiResponse_1.sendApiResponse)(res, 200, result.message, null);
    }),
    createAllocation: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const { budgetId } = (0, express_1.getValidatedParams)(req);
        const data = (0, express_1.getValidatedBody)(req);
        const allocation = await budget_service_1.BudgetService.createAllocation(budgetId, userId, data);
        return (0, apiResponse_1.sendApiResponse)(res, 201, "Allocation created successfully", allocation);
    }),
    updateAllocation: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const { budgetId, id } = (0, express_1.getValidatedParams)(req);
        const data = (0, express_1.getValidatedBody)(req);
        const allocation = await budget_service_1.BudgetService.updateAllocation(budgetId, id, userId, data);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Allocation updated successfully", allocation);
    }),
    deleteAllocation: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const { budgetId, id } = (0, express_1.getValidatedParams)(req);
        const result = await budget_service_1.BudgetService.deleteAllocation(budgetId, id, userId);
        return (0, apiResponse_1.sendApiResponse)(res, 200, result.message, null);
    }),
};
