"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.ApiError = void 0;
const config_1 = require("../config/config");
const logger_1 = __importDefault(require("../config/logger"));
class ApiError extends Error {
    constructor(statusCode, message, errors = [], isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.isOperational = isOperational;
        if (typeof errors === "string" ||
            (typeof errors === "object" && !Array.isArray(errors))) {
            this.errors = [errors];
        }
        else if (Array.isArray(errors)) {
            this.errors = errors;
        }
        else {
            this.errors = [];
        }
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        else {
            this.stack = new Error(message).stack;
        }
    }
}
exports.ApiError = ApiError;
const globalErrorHandler = (err, req, res, _next) => {
    let error;
    if (err instanceof ApiError) {
        error = err;
    }
    else if (err instanceof Error) {
        error = new ApiError(500, err.message || "Something went wrong!", [], false);
        error.stack = err.stack;
    }
    else {
        error = new ApiError(500, "Something went wrong!", [], false);
    }
    const statusCode = error.statusCode || 500;
    const status = error.status || "error";
    if (config_1.config.server.nodeEnv === "development") {
        const response = {
            status,
            message: error.message,
            errors: error.errors,
            stack: error.stack,
        };
        res.status(statusCode).json(response);
    }
    else {
        if (error.isOperational) {
            const response = {
                status,
                message: error.message,
                errors: error.errors,
            };
            res.status(statusCode).json(response);
        }
        else {
            logger_1.default.error("Unhandled error in asyncHandler", {
                method: req.method,
                url: req.originalUrl,
                ip: req.ip,
                error: error instanceof Error
                    ? { message: error.message, stack: error.stack }
                    : error,
            });
            const response = {
                status: "error",
                message: "Something went wrong!",
                errors: [],
            };
            res.status(500).json(response);
        }
    }
};
exports.globalErrorHandler = globalErrorHandler;
