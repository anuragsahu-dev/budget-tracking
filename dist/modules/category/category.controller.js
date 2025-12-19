"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const category_service_1 = require("./category.service");
const apiResponse_1 = require("../../utils/apiResponse");
const express_1 = require("../../types/express");
exports.CategoryController = {
    getAllCategories: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const query = (0, express_1.getValidatedQuery)(req);
        const categories = await category_service_1.CategoryService.getAllCategories(userId, query.includeSystem ?? true);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Categories fetched successfully", categories);
    }),
    getCategoryById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const { id } = (0, express_1.getValidatedParams)(req);
        const category = await category_service_1.CategoryService.getCategoryById(id, userId);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Category fetched successfully", category);
    }),
    createCategory: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const data = (0, express_1.getValidatedBody)(req);
        const category = await category_service_1.CategoryService.createCategory(userId, data);
        return (0, apiResponse_1.sendApiResponse)(res, 201, "Category created successfully", category);
    }),
    updateCategory: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const { id } = (0, express_1.getValidatedParams)(req);
        const data = (0, express_1.getValidatedBody)(req);
        const category = await category_service_1.CategoryService.updateCategory(id, userId, data);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Category updated successfully", category);
    }),
    deleteCategory: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const { id } = (0, express_1.getValidatedParams)(req);
        const result = await category_service_1.CategoryService.deleteCategory(id, userId);
        return (0, apiResponse_1.sendApiResponse)(res, 200, result.message, null);
    }),
};
