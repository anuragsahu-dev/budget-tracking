import { AdminRepository } from "./admin.repository";
import { ApiError } from "../../middlewares/error.middleware";
import type {
  CreateSystemCategoryInput,
  UpdateSystemCategoryInput,
  ListUsersQuery,
  UpdateUserStatusInput,
  StatsQuery,
} from "./admin.validation";
import logger from "../../config/logger";
import { generateSlug } from "../../utils/slug";

// ========== SYSTEM CATEGORY SERVICE ==========

export class AdminService {
  /**
   * Get all system categories
   */
  static async getAllSystemCategories() {
    const categories = await AdminRepository.findAllSystemCategories();

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      color: category.color,
      createdAt: category.createdAt,
    }));
  }

  /**
   * Create a new system category
   */
  static async createSystemCategory(data: CreateSystemCategoryInput) {
    const slug = generateSlug(data.name);

    // Check if slug already exists
    const existing = await AdminRepository.findSystemCategoryBySlug(slug);
    if (existing) {
      throw new ApiError(
        409,
        "A system category with a similar name already exists"
      );
    }

    const result = await AdminRepository.createSystemCategory({
      name: data.name,
      slug,
      color: data.color ?? null,
    });

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("System category created", {
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

  /**
   * Update a system category
   */
  static async updateSystemCategory(
    categoryId: string,
    data: UpdateSystemCategoryInput
  ) {
    const category = await AdminRepository.findSystemCategoryById(categoryId);

    if (!category) {
      throw new ApiError(404, "System category not found");
    }

    const updateData: { name?: string; slug?: string; color?: string | null } =
      {};

    // Check for slug conflicts if name is being updated
    if (data.name && data.name !== category.name) {
      const newSlug = generateSlug(data.name);

      if (newSlug !== category.slug) {
        const existing = await AdminRepository.findSystemCategoryBySlug(
          newSlug
        );
        if (existing && existing.id !== categoryId) {
          throw new ApiError(
            409,
            "A system category with a similar name already exists"
          );
        }
        updateData.slug = newSlug;
      }

      updateData.name = data.name;
    }

    if (data.color !== undefined) {
      updateData.color = data.color;
    }

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, "No valid fields to update");
    }

    const result = await AdminRepository.updateSystemCategory(
      categoryId,
      updateData
    );

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("System category updated", { categoryId });

    return {
      id: result.data.id,
      name: result.data.name,
      slug: result.data.slug,
      color: result.data.color,
      createdAt: result.data.createdAt,
    };
  }

  /**
   * Delete a system category
   */
  static async deleteSystemCategory(categoryId: string) {
    const category = await AdminRepository.findSystemCategoryById(categoryId);

    if (!category) {
      throw new ApiError(404, "System category not found");
    }

    // Check if category is in use
    const hasTransactions = await AdminRepository.systemCategoryHasTransactions(
      categoryId
    );
    if (hasTransactions) {
      throw new ApiError(
        409,
        "Cannot delete system category with existing transactions"
      );
    }

    const hasBudgetAllocations =
      await AdminRepository.systemCategoryHasBudgetAllocations(categoryId);
    if (hasBudgetAllocations) {
      throw new ApiError(
        409,
        "Cannot delete system category with existing budget allocations"
      );
    }

    const result = await AdminRepository.deleteSystemCategory(categoryId);

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("System category deleted", { categoryId });

    return { message: "System category deleted successfully" };
  }

  // ========== USER MANAGEMENT SERVICE ==========

  /**
   * Get all users with filters and pagination
   */
  static async getAllUsers(query: ListUsersQuery) {
    const { role, status, search, page, limit, sortBy, sortOrder } = query;

    const result = await AdminRepository.findAllUsers(
      { role, status, search },
      { page, limit, sortBy, sortOrder }
    );

    return {
      users: result.data,
      meta: result.meta,
    };
  }

  /**
   * Get a single user by ID
   */
  static async getUserById(userId: string) {
    const user = await AdminRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  /**
   * Update user status
   */
  static async updateUserStatus(
    userId: string,
    adminId: string,
    data: UpdateUserStatusInput
  ) {
    // Prevent admin from changing their own status
    if (userId === adminId) {
      throw new ApiError(403, "You cannot change your own status");
    }

    const user = await AdminRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.status === data.status) {
      throw new ApiError(400, `User already has the ${data.status} status`);
    }

    const result = await AdminRepository.updateUserStatus(userId, data.status);

    if (!result.success) {
      throw new ApiError(result.statusCode, result.message);
    }

    logger.info("User status updated", {
      userId,
      adminId,
      oldStatus: user.status,
      newStatus: data.status,
    });

    return result.data;
  }

  // ========== STATISTICS SERVICE ==========

  /**
   * Get platform statistics
   */
  static async getStats(query: StatsQuery) {
    const { from, to } = query;

    const stats = await AdminRepository.getStats(from, to);

    logger.info("Admin stats retrieved", { from, to });

    return stats;
  }
}
