"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const category_repository_1 = require("./category.repository");
const error_middleware_1 = require("../../middlewares/error.middleware");
const logger_1 = __importDefault(require("../../config/logger"));
const slug_1 = require("../../utils/slug");
class CategoryService {
    static async getAllCategories(userId, includeSystem = true) {
        const categories = await category_repository_1.CategoryRepository.findAllByUser(userId, includeSystem);
        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            color: category.color,
            isSystem: category.userId === null,
            createdAt: category.createdAt,
        }));
    }
    static async getCategoryById(categoryId, userId) {
        const category = await category_repository_1.CategoryRepository.findById(categoryId);
        if (!category) {
            throw new error_middleware_1.ApiError(404, "Category not found");
        }
        if (category.userId !== null && category.userId !== userId) {
            throw new error_middleware_1.ApiError(403, "You do not have access to this category");
        }
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            color: category.color,
            isSystem: category.userId === null,
            createdAt: category.createdAt,
        };
    }
    static async createCategory(userId, data) {
        const slug = (0, slug_1.generateSlug)(data.name);
        const systemCategory = await category_repository_1.CategoryRepository.findSystemCategoryBySlug(slug);
        if (systemCategory) {
            throw new error_middleware_1.ApiError(409, `A system category with a similar name already exists ("${systemCategory.name}"). Please choose a different name.`);
        }
        const userCategory = await category_repository_1.CategoryRepository.findBySlugAndUser(slug, userId);
        if (userCategory) {
            throw new error_middleware_1.ApiError(409, "You already have a category with a similar name");
        }
        const result = await category_repository_1.CategoryRepository.create({
            name: data.name,
            slug,
            color: data.color ?? null,
            user: { connect: { id: userId } },
        });
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
        const category = result.data;
        logger_1.default.info("Category created", { userId, categoryId: category.id, slug });
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            color: category.color,
            isSystem: false,
            createdAt: category.createdAt,
        };
    }
    static async updateCategory(categoryId, userId, data) {
        const category = await category_repository_1.CategoryRepository.findById(categoryId);
        if (!category) {
            throw new error_middleware_1.ApiError(404, "Category not found");
        }
        if (category.userId === null) {
            throw new error_middleware_1.ApiError(403, "System categories cannot be modified");
        }
        if (category.userId !== userId) {
            throw new error_middleware_1.ApiError(403, "You do not have access to this category");
        }
        const updateData = {};
        if (data.name && data.name !== category.name) {
            const newSlug = (0, slug_1.generateSlug)(data.name);
            if (newSlug !== category.slug) {
                const systemCategory = await category_repository_1.CategoryRepository.findSystemCategoryBySlug(newSlug);
                if (systemCategory) {
                    throw new error_middleware_1.ApiError(409, `A system category with a similar name already exists ("${systemCategory.name}"). Please choose a different name.`);
                }
                const userCategory = await category_repository_1.CategoryRepository.findBySlugAndUser(newSlug, userId);
                if (userCategory && userCategory.id !== categoryId) {
                    throw new error_middleware_1.ApiError(409, "You already have a category with a similar name");
                }
                updateData.slug = newSlug;
            }
            updateData.name = data.name;
        }
        if (data.color !== undefined)
            updateData.color = data.color;
        if (Object.keys(updateData).length === 0) {
            throw new error_middleware_1.ApiError(400, "No valid fields to update");
        }
        const result = await category_repository_1.CategoryRepository.update(categoryId, updateData);
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
        const updatedCategory = result.data;
        logger_1.default.info("Category updated", { userId, categoryId });
        return {
            id: updatedCategory.id,
            name: updatedCategory.name,
            slug: updatedCategory.slug,
            color: updatedCategory.color,
            isSystem: false,
            createdAt: updatedCategory.createdAt,
        };
    }
    static async deleteCategory(categoryId, userId) {
        const category = await category_repository_1.CategoryRepository.findById(categoryId);
        if (!category) {
            throw new error_middleware_1.ApiError(404, "Category not found");
        }
        if (category.userId === null) {
            throw new error_middleware_1.ApiError(403, "System categories cannot be deleted");
        }
        if (category.userId !== userId) {
            throw new error_middleware_1.ApiError(403, "You do not have access to this category");
        }
        const hasTransactions = await category_repository_1.CategoryRepository.hasTransactions(categoryId);
        if (hasTransactions) {
            throw new error_middleware_1.ApiError(409, "Cannot delete category with existing transactions. Remove or reassign transactions first.");
        }
        const hasBudgetAllocations = await category_repository_1.CategoryRepository.hasBudgetAllocations(categoryId);
        if (hasBudgetAllocations) {
            throw new error_middleware_1.ApiError(409, "Cannot delete category with existing budget allocations. Remove allocations first.");
        }
        const result = await category_repository_1.CategoryRepository.delete(categoryId);
        if (!result.success) {
            throw new error_middleware_1.ApiError(result.statusCode, result.message);
        }
        logger_1.default.info("Category deleted", { userId, categoryId });
        return { message: "Category deleted successfully" };
    }
}
exports.CategoryService = CategoryService;
