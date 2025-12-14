import { z } from "zod";
import { ulidSchema } from "../../validations/common.schema";

// ========== SYSTEM CATEGORY SCHEMAS ==========

const hexColorSchema = z
  .string()
  .regex(
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    "Invalid hex color format (e.g., #FF5733)"
  )
  .nullable()
  .optional();

const categoryNameSchema = z
  .string()
  .trim()
  .min(2, "Category name must be at least 2 characters")
  .max(50, "Category name must not exceed 50 characters");

export const createSystemCategorySchema = z.object({
  name: categoryNameSchema,
  color: hexColorSchema,
});

export type CreateSystemCategoryInput = z.infer<
  typeof createSystemCategorySchema
>;

export const updateSystemCategorySchema = z.object({
  name: categoryNameSchema.optional(),
  color: hexColorSchema,
});

export type UpdateSystemCategoryInput = z.infer<
  typeof updateSystemCategorySchema
>;

export const systemCategoryIdParamSchema = z.object({
  id: ulidSchema,
});

export type SystemCategoryIdParam = z.infer<typeof systemCategoryIdParamSchema>;

// ========== USER MANAGEMENT SCHEMAS ==========

export const userIdParamSchema = z.object({
  id: ulidSchema,
});

export type UserIdParam = z.infer<typeof userIdParamSchema>;

export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "DELETED"]),
});

export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;

export const listUsersQuerySchema = z.object({
  role: z.enum(["USER", "ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "DELETED"]).optional(),
  search: z.string().trim().max(100).optional(),
  page: z.coerce
    .number()
    .int()
    .positive("Page must be a positive integer")
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .positive("Limit must be a positive integer")
    .max(100, "Limit cannot exceed 100")
    .default(20),
  sortBy: z.enum(["createdAt", "fullName", "email"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

// ========== STATISTICS SCHEMA ==========

export const statsQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type StatsQuery = z.infer<typeof statsQuerySchema>;
