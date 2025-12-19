"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const admin_repository_1 = require("./admin.repository");
const planPricing_repository_1 = require("./planPricing.repository");
const error_middleware_1 = require("../../middlewares/error.middleware");
const logger_1 = __importDefault(require("../../config/logger"));
const slug_1 = require("../../utils/slug");
class AdminService {
    static async getAllSystemCategories() {
        const categories = await admin_repository_1.AdminRepository.findAllSystemCategories();
        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            color: category.color,
            createdAt: category.createdAt,
        }));
    }
    static async createSystemCategory(data) {
        const slug = (0, slug_1.generateSlug)(data.name);
        const existing = await admin_repository_1.AdminRepository.findSystemCategoryBySlug(slug);
        if (existing) {
            throw new error_middleware_1.ApiError(409, "A system category with a similar name already exists");
        }
        const result = await admin_repository_1.AdminRepository.createSystemCategory({
            name: data.name,
            slug,
            color: data.color ?? null,
        });
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
        logger_1.default.info("System category created", {
            categoryId: result.data.id,
            name: result.data.name,
            slug: result.data.slug,
        });
        return {
            id: result.data.id,
            name: result.data.name,
            slug: result.data.slug,
            color: result.data.color,
            createdAt: result.data.createdAt,
        };
    }
    static async updateSystemCategory(categoryId, data) {
        const category = await admin_repository_1.AdminRepository.findSystemCategoryById(categoryId);
        if (!category) {
            throw new error_middleware_1.ApiError(404, "System category not found");
        }
        const updateData = {};
        if (data.name && data.name !== category.name) {
            const newSlug = (0, slug_1.generateSlug)(data.name);
            if (newSlug !== category.slug) {
                const existing = await admin_repository_1.AdminRepository.findSystemCategoryBySlug(newSlug);
                if (existing && existing.id !== categoryId) {
                    throw new error_middleware_1.ApiError(409, "A system category with a similar name already exists");
                }
                updateData.slug = newSlug;
            }
            updateData.name = data.name;
        }
        if (data.color !== undefined) {
            updateData.color = data.color;
        }
        if (Object.keys(updateData).length === 0) {
            throw new error_middleware_1.ApiError(400, "No valid fields to update");
        }
        const result = await admin_repository_1.AdminRepository.updateSystemCategory(categoryId, updateData);
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
        logger_1.default.info("System category updated", { categoryId });
        return {
            id: result.data.id,
            name: result.data.name,
            slug: result.data.slug,
            color: result.data.color,
            createdAt: result.data.createdAt,
        };
    }
    static async deleteSystemCategory(categoryId) {
        const category = await admin_repository_1.AdminRepository.findSystemCategoryById(categoryId);
        if (!category) {
            throw new error_middleware_1.ApiError(404, "System category not found");
        }
        const hasTransactions = await admin_repository_1.AdminRepository.systemCategoryHasTransactions(categoryId);
        if (hasTransactions) {
            throw new error_middleware_1.ApiError(409, "Cannot delete system category with existing transactions");
        }
        const hasBudgetAllocations = await admin_repository_1.AdminRepository.systemCategoryHasBudgetAllocations(categoryId);
        if (hasBudgetAllocations) {
            throw new error_middleware_1.ApiError(409, "Cannot delete system category with existing budget allocations");
        }
        const result = await admin_repository_1.AdminRepository.deleteSystemCategory(categoryId);
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
        logger_1.default.info("System category deleted", { categoryId });
        return { message: "System category deleted successfully" };
    }
    static async getAllUsers(query) {
        const { role, status, search, page, limit, sortBy, sortOrder } = query;
        const result = await admin_repository_1.AdminRepository.findAllUsers({ role, status, search }, { page, limit, sortBy, sortOrder });
        return {
            users: result.data,
            meta: result.meta,
        };
    }
    static async getUserById(userId) {
        const user = await admin_repository_1.AdminRepository.findUserById(userId);
        if (!user) {
            throw new error_middleware_1.ApiError(404, "User not found");
        }
        return user;
    }
    static async updateUserStatus(userId, adminId, data) {
        if (userId === adminId) {
            throw new error_middleware_1.ApiError(403, "You cannot change your own status");
        }
        const user = await admin_repository_1.AdminRepository.findUserById(userId);
        if (!user) {
            throw new error_middleware_1.ApiError(404, "User not found");
        }
        if (user.status === data.status) {
            throw new error_middleware_1.ApiError(400, `User already has the ${data.status} status`);
        }
        const result = await admin_repository_1.AdminRepository.updateUserStatus(userId, data.status);
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
        logger_1.default.info("User status updated", {
            userId,
            adminId,
            oldStatus: user.status,
            newStatus: data.status,
        });
        return result.data;
    }
    static async getStats(query) {
        const { from, to } = query;
        const stats = await admin_repository_1.AdminRepository.getStats(from, to);
        logger_1.default.info("Admin stats retrieved", { from, to });
        return stats;
    }
    static async getAllPayments(query) {
        const { userId, status, plan, from, to, page, limit, sortBy, sortOrder } = query;
        const result = await admin_repository_1.AdminRepository.findAllPayments({ userId, status, plan, from, to }, { page, limit, sortBy, sortOrder });
        return {
            payments: result.data,
            meta: result.meta,
        };
    }
    static async getPaymentById(paymentId) {
        const payment = await admin_repository_1.AdminRepository.findPaymentById(paymentId);
        if (!payment) {
            throw new error_middleware_1.ApiError(404, "Payment not found");
        }
        return payment;
    }
    static async getPaymentStats(query) {
        const { from, to } = query;
        const stats = await admin_repository_1.AdminRepository.getPaymentStats(from, to);
        logger_1.default.info("Payment stats retrieved", { from, to });
        return stats;
    }
    static async getAllPlanPricing() {
        const pricing = await planPricing_repository_1.PlanPricingRepository.findAll();
        return pricing;
    }
    static async getActivePlanPricing() {
        const pricing = await planPricing_repository_1.PlanPricingRepository.findAllActive();
        return pricing;
    }
    static async createPlanPricing(data) {
        const result = await planPricing_repository_1.PlanPricingRepository.create(data);
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
        logger_1.default.info("Plan pricing created", {
            pricingId: result.data.id,
            plan: result.data.plan,
            currency: result.data.currency,
        });
        return result.data;
    }
    static async updatePlanPricing(pricingId, data) {
        const pricing = await planPricing_repository_1.PlanPricingRepository.findById(pricingId);
        if (!pricing) {
            throw new error_middleware_1.ApiError(404, "Plan pricing not found");
        }
        if (Object.keys(data).length === 0) {
            throw new error_middleware_1.ApiError(400, "No valid fields to update");
        }
        const result = await planPricing_repository_1.PlanPricingRepository.update(pricingId, data);
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
        logger_1.default.info("Plan pricing updated", { pricingId });
        return result.data;
    }
    static async deletePlanPricing(pricingId) {
        const pricing = await planPricing_repository_1.PlanPricingRepository.findById(pricingId);
        if (!pricing) {
            throw new error_middleware_1.ApiError(404, "Plan pricing not found");
        }
        const result = await planPricing_repository_1.PlanPricingRepository.delete(pricingId);
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
        logger_1.default.info("Plan pricing deleted", { pricingId });
        return { message: "Plan pricing deleted successfully" };
    }
}
exports.AdminService = AdminService;
