"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const user_service_1 = require("./user.service");
const apiResponse_1 = require("../../utils/apiResponse");
const express_1 = require("../../types/express");
exports.UserController = {
    getProfile: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const profile = await user_service_1.UserService.getProfile(userId);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Profile fetched successfully", profile);
    }),
    updateProfile: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const updateData = (0, express_1.getValidatedBody)(req);
        const updatedProfile = await user_service_1.UserService.updateProfile(userId, updateData);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Profile updated successfully", updatedProfile);
    }),
    getAvatarUploadUrl: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { mime } = (0, express_1.getValidatedQuery)(req);
        const result = await user_service_1.UserService.getAvatarUploadUrl(mime);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Upload URL generated successfully", result);
    }),
    confirmAvatarUpload: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const data = (0, express_1.getValidatedBody)(req);
        const result = await user_service_1.UserService.confirmAvatarUpload(userId, data);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Avatar updated successfully", result);
    }),
    deleteAvatar: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const result = await user_service_1.UserService.deleteAvatar(userId);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Avatar deleted successfully", result);
    }),
};
