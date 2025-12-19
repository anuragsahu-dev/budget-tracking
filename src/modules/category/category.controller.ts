import { asyncHandler } from "../../utils/asyncHandler";
import type { Request, Response } from "express";
import { CategoryService } from "./category.service";
import { sendApiResponse } from "../../utils/apiResponse";
import {
  getValidatedBody,
  getValidatedParams,
  getValidatedQuery,
} from "../../types/express";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryIdParam,
  ListCategoriesQuery,
} from "./category.validation";

export const CategoryController = {
  /**
   * @route   GET /api/v1/categories
   * @desc    Get all categories (system + user's)
   * @access  Private
   */
  getAllCategories: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const query = getValidatedQuery<ListCategoriesQuery>(req);

    const categories = await CategoryService.getAllCategories(
      userId,
      query.includeSystem ?? true
    );

    return sendApiResponse(
      res,
      200,
      "Categories fetched successfully",
      categories
    );
  }),

  getCategoryById: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { id } = getValidatedParams<CategoryIdParam>(req);

    const category = await CategoryService.getCategoryById(id, userId);

    return sendApiResponse(res, 200, "Category fetched successfully", category);
  }),

  createCategory: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const data = getValidatedBody<CreateCategoryInput>(req);

    const category = await CategoryService.createCategory(userId, data);

    return sendApiResponse(res, 201, "Category created successfully", category);
  }),

  updateCategory: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { id } = getValidatedParams<CategoryIdParam>(req);
    const data = getValidatedBody<UpdateCategoryInput>(req);

    const category = await CategoryService.updateCategory(id, userId, data);

    return sendApiResponse(res, 200, "Category updated successfully", category);
  }),

  deleteCategory: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { id } = getValidatedParams<CategoryIdParam>(req);

    const result = await CategoryService.deleteCategory(id, userId);

    return sendApiResponse(res, 200, result.message, null);
  }),
};
