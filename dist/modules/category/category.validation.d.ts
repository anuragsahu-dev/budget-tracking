import { z } from "zod";
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export declare const categoryIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type CategoryIdParam = z.infer<typeof categoryIdParamSchema>;
export declare const listCategoriesQuerySchema: z.ZodObject<{
    includeSystem: z.ZodPipe<z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>, z.ZodTransform<boolean, "true" | "false" | undefined>>;
}, z.core.$strip>;
export type ListCategoriesQuery = z.infer<typeof listCategoriesQuerySchema>;
