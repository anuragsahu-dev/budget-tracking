"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const analytics_service_1 = require("./analytics.service");
const apiResponse_1 = require("../../utils/apiResponse");
const express_1 = require("../../types/express");
exports.AnalyticsController = {
    getMonthlySummary: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const query = (0, express_1.getValidatedQuery)(req);
        const summary = await analytics_service_1.AnalyticsService.getMonthlySummary(userId, query);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Monthly summary fetched successfully", summary);
    }),
    getYearlySummary: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const query = (0, express_1.getValidatedQuery)(req);
        const summary = await analytics_service_1.AnalyticsService.getYearlySummary(userId, query);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Yearly summary fetched successfully", summary);
    }),
    getCategorySummary: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const query = (0, express_1.getValidatedQuery)(req);
        const summary = await analytics_service_1.AnalyticsService.getCategorySummary(userId, query);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Category summary fetched successfully", summary);
    }),
    getTrends: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const query = (0, express_1.getValidatedQuery)(req);
        const trends = await analytics_service_1.AnalyticsService.getTrends(userId, query);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Trends fetched successfully", trends);
    }),
    getBudgetComparison: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const query = (0, express_1.getValidatedQuery)(req);
        const comparison = await analytics_service_1.AnalyticsService.getBudgetComparison(userId, query.month, query.year);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Budget comparison fetched successfully", comparison);
    }),
    getDashboardOverview: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const overview = await analytics_service_1.AnalyticsService.getDashboardOverview(userId);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Dashboard overview fetched successfully", overview);
    }),
};
