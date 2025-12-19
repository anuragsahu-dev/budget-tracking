"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const admin_service_1 = require("./admin.service");
const apiResponse_1 = require("../../utils/apiResponse");
const express_1 = require("../../types/express");
exports.AdminController = {
    getAllSystemCategories: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const categories = await admin_service_1.AdminService.getAllSystemCategories();
        return (0, apiResponse_1.sendApiResponse)(res, 200, "System categories fetched successfully", categories);
    }),
    createSystemCategory: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const data = (0, express_1.getValidatedBody)(req);
        const category = await admin_service_1.AdminService.createSystemCategory(data);
        return (0, apiResponse_1.sendApiResponse)(res, 201, "System category created successfully", category);
    }),
    updateSystemCategory: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = (0, express_1.getValidatedParams)(req);
        const data = (0, express_1.getValidatedBody)(req);
        const category = await admin_service_1.AdminService.updateSystemCategory(id, data);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "System category updated successfully", category);
    }),
    deleteSystemCategory: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = (0, express_1.getValidatedParams)(req);
        const result = await admin_service_1.AdminService.deleteSystemCategory(id);
        return (0, apiResponse_1.sendApiResponse)(res, 200, result.message, null);
    }),
    getAllUsers: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const query = (0, express_1.getValidatedQuery)(req);
        const result = await admin_service_1.AdminService.getAllUsers(query);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Users fetched successfully", result.users, result.meta);
    }),
    getUserById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = (0, express_1.getValidatedParams)(req);
        const user = await admin_service_1.AdminService.getUserById(id);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "User fetched successfully", user);
    }),
    updateUserStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const adminId = req.userId;
        const { id } = (0, express_1.getValidatedParams)(req);
        const data = (0, express_1.getValidatedBody)(req);
        const user = await admin_service_1.AdminService.updateUserStatus(id, adminId, data);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "User status updated successfully", user);
    }),
    getStats: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const query = (0, express_1.getValidatedQuery)(req);
        const stats = await admin_service_1.AdminService.getStats(query);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Statistics fetched successfully", stats);
    }),
    getAllPayments: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const query = (0, express_1.getValidatedQuery)(req);
        const result = await admin_service_1.AdminService.getAllPayments(query);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Payments fetched successfully", result.payments, result.meta);
    }),
    getPaymentById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = (0, express_1.getValidatedParams)(req);
        const payment = await admin_service_1.AdminService.getPaymentById(id);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Payment fetched successfully", payment);
    }),
    getPaymentStats: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const query = (0, express_1.getValidatedQuery)(req);
        const stats = await admin_service_1.AdminService.getPaymentStats(query);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Payment statistics fetched successfully", stats);
    }),
    getAllPlanPricing: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const pricing = await admin_service_1.AdminService.getAllPlanPricing();
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Plan pricing fetched successfully", pricing);
    }),
    createPlanPricing: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const data = (0, express_1.getValidatedBody)(req);
        const pricing = await admin_service_1.AdminService.createPlanPricing(data);
        return (0, apiResponse_1.sendApiResponse)(res, 201, "Plan pricing created successfully", pricing);
    }),
    updatePlanPricing: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = (0, express_1.getValidatedParams)(req);
        const data = (0, express_1.getValidatedBody)(req);
        const pricing = await admin_service_1.AdminService.updatePlanPricing(id, data);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Plan pricing updated successfully", pricing);
    }),
    deletePlanPricing: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = (0, express_1.getValidatedParams)(req);
        const result = await admin_service_1.AdminService.deletePlanPricing(id);
        return (0, apiResponse_1.sendApiResponse)(res, 200, result.message, null);
    }),
};
