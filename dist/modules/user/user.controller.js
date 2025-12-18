"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const user_service_1 = require("./user.service");
const apiResponse_1 = require("../../utils/apiResponse");
const express_1 = require("../../types/express");
const logger_1 = __importDefault(require("../../config/logger"));
exports.UserController = {
    getProfile: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const profile = await user_service_1.UserService.getProfile(userId);
        logger_1.default.info("User profile fetched", { userId });
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Profile fetched successfully", profile);
    }),
    updateProfile: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const updateData = (0, express_1.getValidatedBody)(req);
        const updatedProfile = await user_service_1.UserService.updateProfile(userId, updateData);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Profile updated successfully", updatedProfile);
    }),
};
