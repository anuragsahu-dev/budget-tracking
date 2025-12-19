"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const repository_utils_1 = require("../../utils/repository.utils");
class PaymentRepository {
    static async createPayment(data) {
        try {
            const payment = await prisma_1.default.payment.create({ data });
            return { success: true, data: payment };
        }
        catch (error) {
            return (0, repository_utils_1.unknownError)("Failed to create payment", error);
        }
    }
    static async findByProviderOrderId(providerOrderId) {
        return prisma_1.default.payment.findFirst({
            where: { providerOrderId },
        });
    }
    static async findByProviderPaymentId(providerPaymentId) {
        return prisma_1.default.payment.findUnique({
            where: { providerPaymentId },
        });
    }
    static async updatePaymentStatus(id, status, data) {
        try {
            const payment = await prisma_1.default.payment.update({
                where: { id },
                data: {
                    status,
                    ...data,
                },
            });
            return { success: true, data: payment };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                return (0, repository_utils_1.notFoundError)("Payment not found");
            }
            return (0, repository_utils_1.unknownError)("Failed to update payment", error);
        }
    }
    static async findByUserId(userId) {
        return prisma_1.default.payment.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }
    static async updateByProviderOrderId(providerOrderId, data) {
        try {
            const payment = await prisma_1.default.payment.updateMany({
                where: { providerOrderId },
                data,
            });
            if (payment.count === 0) {
                return (0, repository_utils_1.notFoundError)("Payment not found");
            }
            const updated = await prisma_1.default.payment.findFirst({
                where: { providerOrderId },
            });
            if (!updated) {
                return (0, repository_utils_1.notFoundError)("Payment not found after update");
            }
            return { success: true, data: updated };
        }
        catch (error) {
            return (0, repository_utils_1.unknownError)("Failed to update payment", error);
        }
    }
}
exports.PaymentRepository = PaymentRepository;
