"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategoriesQuerySchema = exports.categoryIdParamSchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("../../validations/common.schema");
const hexColorSchema = zod_1.z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format (e.g., #FF5733)")
    .nullable();
const catagoryNameSchema = zod_1.z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must not exceed 50 characters");
exports.createCategorySchema = zod_1.z.object({
    name: catagoryNameSchema,
    color: hexColorSchema.optional(),
});
exports.updateCategorySchema = zod_1.z.object({
    name: catagoryNameSchema.optional(),
    color: hexColorSchema.optional(),
});
exports.categoryIdParamSchema = zod_1.z.object({
    id: common_schema_1.ulidSchema,
});
exports.listCategoriesQuerySchema = zod_1.z.object({
    includeSystem: zod_1.z
        .enum(["true", "false"])
        .optional()
        .transform((val) => val !== "false"),
});
