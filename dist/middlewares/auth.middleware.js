"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_middleware_1 = require("./error.middleware");
const logger_1 = __importDefault(require("../config/logger"));
const config_1 = require("../config/config");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.verifyJWT = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;
    const accessToken = req.cookies.accessToken || token;
    if (!accessToken) {
        throw new error_middleware_1.ApiError(401, "Authentication failed. Please log in.");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(accessToken, config_1.config.auth.accessTokenSecret);
        if (!decoded.id) {
            logger_1.default.warn("Access token decoded, but have invalid payload", {
                ip: req.ip,
            });
            throw new error_middleware_1.ApiError(401, "Authentication failed. Please log in.");
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    }
    catch (error) {
        logger_1.default.error("Access Token Verification failed", {
            error: error,
            ip: req.ip,
        });
        return next(new error_middleware_1.ApiError(401, "Authentication failed. Please log in."));
    }
});
