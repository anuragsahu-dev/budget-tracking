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

router.use(verifyJWT);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: includeSystem
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Include system categories
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/",
  validate({ query: listCategoriesQuerySchema }),
  CategoryController.getAllCategories
);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category fetched successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized to access this category
 *       404:
 *         description: Category not found
 */
router.get(
  "/:id",
  validate({ params: categoryIdParamSchema }),
  CategoryController.getCategoryById
);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               color:
 *                 type: string
 *                 pattern: "^#[0-9A-Fa-f]{6}$"
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 *       409:
 *         description: Category with similar name exists
 */
router.post(
  "/",
  validate({ body: createCategorySchema }),
  CategoryController.createCategory
);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Cannot update system category
 *       404:
 *         description: Category not found
 */
router.patch(
  "/:id",
  validate({ params: categoryIdParamSchema, body: updateCategorySchema }),
  CategoryController.updateCategory
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Cannot delete system category
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category is in use
 */
router.delete(
  "/:id",
  validate({ params: categoryIdParamSchema }),
  CategoryController.deleteCategory
);

export default router;
