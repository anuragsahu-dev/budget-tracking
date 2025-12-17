import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { CategoryController } from "./category.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
  listCategoriesQuerySchema,
} from "./category.validation";

const router = Router();

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories (system + user's own)
 * @access  Private
 * @query   includeSystem - "true" or "false" (default: "true")
 */
router.get(
  "/",
  verifyJWT,
  validate({ query: listCategoriesQuerySchema }),
  CategoryController.getAllCategories
);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get a single category by ID
 * @access  Private
 */
router.get(
  "/:id",
  verifyJWT,
  validate({ params: categoryIdParamSchema }),
  CategoryController.getCategoryById
);

/**
 * @route   POST /api/v1/categories
 * @desc    Create a new category
 * @access  Private
 */
router.post(
  "/",
  verifyJWT,
  validate({ body: createCategorySchema }),
  CategoryController.createCategory
);

/**
 * @route   PATCH /api/v1/categories/:id
 * @desc    Update a category (name, color)
 * @access  Private
 */
router.patch(
  "/:id",
  verifyJWT,
  validate({ params: categoryIdParamSchema, body: updateCategorySchema }),
  CategoryController.updateCategory
);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete a category
 * @access  Private
 */
router.delete(
  "/:id",
  verifyJWT,
  validate({ params: categoryIdParamSchema }),
  CategoryController.deleteCategory
);

export default router;
