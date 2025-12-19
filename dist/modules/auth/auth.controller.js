"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_service_1 = require("./auth.service");
const apiResponse_1 = require("../../utils/apiResponse");
const session_service_1 = require("../session/session.service");
const ms_1 = __importDefault(require("ms"));
const config_1 = require("../../config/config");
const express_1 = require("../../types/express");
const error_middleware_1 = require("../../middlewares/error.middleware");
function getRefreshToken(req) {
    if (req.cookies?.refreshToken) {
        return req.cookies.refreshToken;
    }
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const [scheme, token] = authHeader.split(" ");
        if ((scheme === "Bearer" || scheme === "Refresh") && token) {
            return token;
        }
    }
    const refreshHeader = req.headers["x-refresh-token"];
    if (typeof refreshHeader === "string") {
        return refreshHeader;
    }
    return undefined;
}
exports.AuthController = {
    start: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const startData = (0, express_1.getValidatedBody)(req);
        const otp = await auth_service_1.AuthService.start(startData);
        return (0, apiResponse_1.sendApiResponse)(res, 200, otp.message);
    }),
    verify: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const verifyData = (0, express_1.getValidatedBody)(req);
        const data = await auth_service_1.AuthService.verify(verifyData);
        const { accessToken, refreshToken } = await session_service_1.SessionService.generateTokens(data.data.id, data.data.role);
        res.cookie("refreshToken", refreshToken, {
            ...session_service_1.cookieOptions,
            maxAge: (0, ms_1.default)(config_1.config.auth.refreshTokenExpiry),
        });
        res.cookie("accessToken", accessToken, {
            ...session_service_1.cookieOptions,
            maxAge: (0, ms_1.default)(config_1.config.auth.accessTokenExpiry),
        });
        return (0, apiResponse_1.sendApiResponse)(res, 200, "User verified successfully", {
            accessToken,
            refreshToken,
            user: data.data,
        });
    }),
    setName: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const setData = (0, express_1.getValidatedBody)(req);
        const result = await auth_service_1.AuthService.setName(setData, userId);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "User's name set successfully", result);
    }),
    me: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const user = await auth_service_1.AuthService.me(userId);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "User fetched successfully", user);
    }),
    googleCallback: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const user = req.user;
        if (!user) {
            throw new error_middleware_1.ApiError(401, "Authentication failed. Please log in.");
        }
        const { accessToken, refreshToken } = await session_service_1.SessionService.generateTokens(user.id, user.role);
        res.cookie("refreshToken", refreshToken, {
            ...session_service_1.cookieOptions,
            maxAge: (0, ms_1.default)(config_1.config.auth.refreshTokenExpiry),
        });
        res.cookie("accessToken", accessToken, {
            ...session_service_1.cookieOptions,
            maxAge: (0, ms_1.default)(config_1.config.auth.accessTokenExpiry),
        });
        return (0, apiResponse_1.sendApiResponse)(res, 200, "User verified successfully", {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
            },
        });
    }),
    logout: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const refreshToken = getRefreshToken(req);
        let sessionRevoked = false;
        if (refreshToken) {
            const result = await session_service_1.SessionService.logout(refreshToken);
            sessionRevoked = result.revoked;
        }
        res.clearCookie("accessToken", session_service_1.cookieOptions);
        res.clearCookie("refreshToken", session_service_1.cookieOptions);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Logged out successfully", {
            sessionRevoked,
        });
    }),
    logoutAll: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const result = await session_service_1.SessionService.logoutAll(userId);
        res.clearCookie("accessToken", session_service_1.cookieOptions);
        res.clearCookie("refreshToken", session_service_1.cookieOptions);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Logged out from all devices", {
            sessionsRevoked: result.count,
        });
    }),
    refreshToken: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const refreshToken = getRefreshToken(req);
        if (!refreshToken) {
            throw new error_middleware_1.ApiError(401, "Refresh token not provided");
        }
        const { accessToken } = await session_service_1.SessionService.refreshAccessToken(refreshToken);
        res.cookie("accessToken", accessToken, {
            ...session_service_1.cookieOptions,
            maxAge: (0, ms_1.default)(config_1.config.auth.accessTokenExpiry),
        });
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Token refreshed successfully", {
            accessToken,
        });
    }),
};
