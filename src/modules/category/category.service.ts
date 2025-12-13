import { CategoryRepository } from "./category.repository";
import { ApiError } from "../../middlewares/error.middleware";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.validation";
import logger from "../../config/logger";

export class CategoryService {
  /**
   * Get all categories for a user (system + user-created)
   */
  static async getAllCategories(userId: string, includeSystem = true) {
    const categories = await CategoryRepository.findAllByUser(
      userId,
      includeSystem
    );

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      color: category.color,
      isSystem: category.userId === null,
      createdAt: category.createdAt,
    }));
  }

  /**
   * Get a single category by ID
   */
  static async getCategoryById(categoryId: string, userId: string) {
    const category = await CategoryRepository.findById(categoryId);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    // Check access: user can access their own categories or system categories
    if (category.userId !== null && category.userId !== userId) {
      throw new ApiError(403, "You do not have access to this category");
    }

    return {
      id: category.id,
      name: category.name,
      color: category.color,
      isSystem: category.userId === null,
      createdAt: category.createdAt,
    };
  }

  /**
   * Create a new user category
   */
  static async createCategory(userId: string, data: CreateCategoryInput) {
    // Check if name conflicts with a system category
    const systemCategory = await CategoryRepository.findSystemCategoryByName(
      data.name
    );

    if (systemCategory) {
      throw new ApiError(
        409,
        "A system category with this name already exists. Please choose a different name."
      );
    }

    // Check if user already has a category with this name
    const userCategory = await CategoryRepository.findByNameAndUser(
      data.name,
      userId
    );

    if (userCategory) {
      throw new ApiError(409, "You already have a category with this name");
    }

    const result = await CategoryRepository.create({
      name: data.name,
      color: data.color ?? null,
      user: { connect: { id: userId } },
    });

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    const category = result.data;

    logger.info("Category created", { userId, categoryId: category.id });

    return {
      id: category.id,
      name: category.name,
      color: category.color,
      isSystem: false,
      createdAt: category.createdAt,
    };
  }

  /**
   * Update an existing category
   */
  static async updateCategory(
    categoryId: string,
    userId: string,
    data: UpdateCategoryInput
  ) {
    const category = await CategoryRepository.findById(categoryId);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    // Only allow updating user's own categories (not system categories)
    if (category.userId === null) {
      throw new ApiError(403, "System categories cannot be modified");
    }

    if (category.userId !== userId) {
      throw new ApiError(403, "You do not have access to this category");
    }

    // Check for duplicate name if name is being changed
    if (data.name && data.name !== category.name) {
      // Check against system categories
      const systemCategory = await CategoryRepository.findSystemCategoryByName(
        data.name
      );
      if (systemCategory) {
        throw new ApiError(
          409,
          "A system category with this name already exists. Please choose a different name."
        );
      }

      // Check against user's own categories
      const userCategory = await CategoryRepository.findByNameAndUser(
        data.name,
        userId
      );
      if (userCategory && userCategory.id !== categoryId) {
        throw new ApiError(409, "You already have a category with this name");
      }
    }

    // Build update object with only provided fields
    const updateData: { name?: string; color?: string | null } = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.color !== undefined) updateData.color = data.color;

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, "No valid fields to update");
    }

    const result = await CategoryRepository.update(categoryId, updateData);

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    const updatedCategory = result.data;

    logger.info("Category updated", { userId, categoryId });

    return {
      id: updatedCategory.id,
      name: updatedCategory.name,
      color: updatedCategory.color,
      isSystem: false,
      createdAt: updatedCategory.createdAt,
    };
  }

  /**
   * Delete a category
   */
  static async deleteCategory(categoryId: string, userId: string) {
    const category = await CategoryRepository.findById(categoryId);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    // Prevent deletion of system categories
    if (category.userId === null) {
      throw new ApiError(403, "System categories cannot be deleted");
    }

    // Prevent deletion of other users' categories
    if (category.userId !== userId) {
      throw new ApiError(403, "You do not have access to this category");
    }

    // Check if category is in use
    const hasTransactions = await CategoryRepository.hasTransactions(
      categoryId
    );
    if (hasTransactions) {
      throw new ApiError(
        409,
        "Cannot delete category with existing transactions. Remove or reassign transactions first."
      );
    }

    const hasBudgetAllocations = await CategoryRepository.hasBudgetAllocations(
      categoryId
    );
    if (hasBudgetAllocations) {
      throw new ApiError(
        409,
        "Cannot delete category with existing budget allocations. Remove allocations first."
      );
    }

    const result = await CategoryRepository.delete(categoryId);

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("Category deleted", { userId, categoryId });

    return { message: "Category deleted successfully" };
  }
}
