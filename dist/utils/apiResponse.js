"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendApiResponse = sendApiResponse;
function sendApiResponse(res, statusCode, message, data = null, meta) {
    return res.status(statusCode).json({
        statusCode,
        success: statusCode < 400,
        message,
        data,
        ...(meta && { meta }),
        timestamp: new Date().toISOString(),
    });
}
