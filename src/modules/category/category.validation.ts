import { z } from "zod";
import { ulidSchema } from "../../validations/common.schema";

// Hex color validation (e.g., #FF5733 or #fff)
const hexColorSchema = z
  .string()
  .regex(
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    "Invalid hex color format (e.g., #FF5733)"
  )
  .nullable();

const catagoryNameSchema = z
  .string()
  .trim()
  .min(2, "Category name must be at least 2 characters")
  .max(50, "Category name must not exceed 50 characters");

export const createCategorySchema = z.object({
  name: catagoryNameSchema,
  color: hexColorSchema.optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  name: catagoryNameSchema.optional(),
  color: hexColorSchema.optional(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const categoryIdParamSchema = z.object({
  id: ulidSchema,
});

export type CategoryIdParam = z.infer<typeof categoryIdParamSchema>;

export const listCategoriesQuerySchema = z.object({
  includeSystem: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => val === "true"),
});

export type ListCategoriesQuery = z.infer<typeof listCategoriesQuerySchema>;
