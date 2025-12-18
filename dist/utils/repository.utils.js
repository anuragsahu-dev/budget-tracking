"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRISMA_ERROR = void 0;
exports.isPrismaError = isPrismaError;
exports.createPaginationMeta = createPaginationMeta;
exports.notFoundError = notFoundError;
exports.duplicateError = duplicateError;
exports.inUseError = inUseError;
exports.unknownError = unknownError;
const logger_1 = __importDefault(require("../config/logger"));
exports.PRISMA_ERROR = {
    RECORD_NOT_FOUND: "P2025",
    UNIQUE_CONSTRAINT_VIOLATION: "P2002",
    FOREIGN_KEY_CONSTRAINT_VIOLATION: "P2003",
};
function isPrismaError(error) {
    return (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof error.code === "string");
}
function createPaginationMeta(total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
}
function notFoundError(message) {
    return {
        success: false,
        error: "NOT_FOUND",
        statusCode: 404,
        message,
    };
}
function duplicateError(message) {
    return {
        success: false,
        error: "DUPLICATE",
        statusCode: 409,
        message,
    };
}
function inUseError(message) {
    return {
        success: false,
        error: "IN_USE",
        statusCode: 409,
        message,
    };
}
function unknownError(message, error) {
    logger_1.default.error(message, { error });
    return {
        success: false,
        error: "UNKNOWN",
        statusCode: 500,
        message,
    };
}
