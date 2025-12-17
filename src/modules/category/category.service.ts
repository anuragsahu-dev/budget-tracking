import { CategoryRepository } from "./category.repository";
import { ApiError } from "../../middlewares/error.middleware";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.validation";
import logger from "../../config/logger";
import { generateSlug } from "../../utils/slug";

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
      slug: category.slug,
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
      slug: category.slug,
      color: category.color,
      isSystem: category.userId === null,
      createdAt: category.createdAt,
    };
  }

  /**
   * Create a new user category
   */
  static async createCategory(userId: string, data: CreateCategoryInput) {
    // Generate slug from category name
    const slug = generateSlug(data.name);

    // Check if slug conflicts with a system category
    // This prevents users from creating categories that normalize to the same slug as system categories
    const systemCategory = await CategoryRepository.findSystemCategoryBySlug(
      slug
    );

    if (systemCategory) {
      throw new ApiError(
        409,
        `A system category with a similar name already exists ("${systemCategory.name}"). Please choose a different name.`
      );
    }

    // Check if user already has a category with this slug
    // This allows different users to have categories with the same slug
    const userCategory = await CategoryRepository.findBySlugAndUser(
      slug,
      userId
    );

    if (userCategory) {
      throw new ApiError(
        409,
        "You already have a category with a similar name"
      );
    }

    const result = await CategoryRepository.create({
      name: data.name,
      slug,
      color: data.color ?? null,
      user: { connect: { id: userId } },
    });

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    const category = result.data;

    logger.info("Category created", { userId, categoryId: category.id, slug });

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
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

    // Build update object with only provided fields
    const updateData: { name?: string; slug?: string; color?: string | null } =
      {};

    // Check for duplicate slug if name is being changed
    if (data.name && data.name !== category.name) {
      const newSlug = generateSlug(data.name);

      // Only validate slug conflicts if the slug actually changes
      if (newSlug !== category.slug) {
        // Check against system categories
        const systemCategory =
          await CategoryRepository.findSystemCategoryBySlug(newSlug);
        if (systemCategory) {
          throw new ApiError(
            409,
            `A system category with a similar name already exists ("${systemCategory.name}"). Please choose a different name.`
          );
        }

        // Check against user's own categories
        const userCategory = await CategoryRepository.findBySlugAndUser(
          newSlug,
          userId
        );
        if (userCategory && userCategory.id !== categoryId) {
          throw new ApiError(
            409,
            "You already have a category with a similar name"
          );
        }

        updateData.slug = newSlug;
      }

      updateData.name = data.name;
    }

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
      slug: updatedCategory.slug,
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
