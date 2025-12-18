"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanPricingRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const repository_utils_1 = require("../../utils/repository.utils");
class PlanPricingRepository {
    static async findByPlanAndCurrency(plan, currency) {
        return prisma_1.default.planPricing.findUnique({
            where: { plan_currency: { plan, currency } },
        });
    }
    static async findAllActive() {
        return prisma_1.default.planPricing.findMany({
            where: { isActive: true },
            orderBy: [{ plan: "asc" }, { currency: "asc" }],
        });
    }
    static async findAll() {
        return prisma_1.default.planPricing.findMany({
            orderBy: [{ plan: "asc" }, { currency: "asc" }],
        });
    }
    static async findById(id) {
        return prisma_1.default.planPricing.findUnique({ where: { id } });
    }
    static async create(data) {
        try {
            const pricing = await prisma_1.default.planPricing.create({ data });
            return { success: true, data: pricing };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
                return (0, repository_utils_1.duplicateError)("Pricing for this plan and currency already exists");
            }
            return (0, repository_utils_1.unknownError)("Failed to create plan pricing", error);
        }
    }
    static async update(id, data) {
        try {
            const pricing = await prisma_1.default.planPricing.update({
                where: { id },
                data,
            });
            return { success: true, data: pricing };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error)) {
                if (error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                    return (0, repository_utils_1.notFoundError)("Plan pricing not found");
                }
                if (error.code === repository_utils_1.PRISMA_ERROR.UNIQUE_CONSTRAINT_VIOLATION) {
                    return (0, repository_utils_1.duplicateError)("Pricing for this plan and currency already exists");
                }
            }
            return (0, repository_utils_1.unknownError)("Failed to update plan pricing", error);
        }
    }
    static async delete(id) {
        try {
            const pricing = await prisma_1.default.planPricing.delete({ where: { id } });
            return { success: true, data: pricing };
        }
        catch (error) {
            if ((0, repository_utils_1.isPrismaError)(error) &&
                error.code === repository_utils_1.PRISMA_ERROR.RECORD_NOT_FOUND) {
                return (0, repository_utils_1.notFoundError)("Plan pricing not found");
            }
            return (0, repository_utils_1.unknownError)("Failed to delete plan pricing", error);
        }
    }
}
exports.PlanPricingRepository = PlanPricingRepository;
