"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const transaction_service_1 = require("./transaction.service");
const apiResponse_1 = require("../../utils/apiResponse");
const express_1 = require("../../types/express");
exports.TransactionController = {
    getAllTransactions: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const query = (0, express_1.getValidatedQuery)(req);
        const result = await transaction_service_1.TransactionService.getAllTransactions(userId, query);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Transactions fetched successfully", result.transactions, result.meta);
    }),
    getTransactionById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const { id } = (0, express_1.getValidatedParams)(req);
        const transaction = await transaction_service_1.TransactionService.getTransactionById(id, userId);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Transaction fetched successfully", transaction);
    }),
    createTransaction: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const data = (0, express_1.getValidatedBody)(req);
        const transaction = await transaction_service_1.TransactionService.createTransaction(userId, data);
        return (0, apiResponse_1.sendApiResponse)(res, 201, "Transaction created successfully", transaction);
    }),
    updateTransaction: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const { id } = (0, express_1.getValidatedParams)(req);
        const data = (0, express_1.getValidatedBody)(req);
        const transaction = await transaction_service_1.TransactionService.updateTransaction(id, userId, data);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Transaction updated successfully", transaction);
    }),
    deleteTransaction: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const { id } = (0, express_1.getValidatedParams)(req);
        const result = await transaction_service_1.TransactionService.deleteTransaction(id, userId);
        return (0, apiResponse_1.sendApiResponse)(res, 200, result.message, null);
    }),
    getTransactionSummary: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const { from, to } = (0, express_1.getValidatedQuery)(req);
        const summary = await transaction_service_1.TransactionService.getTransactionSummary(userId, from, to);
        return (0, apiResponse_1.sendApiResponse)(res, 200, "Transaction summary fetched successfully", summary);
    }),
};
