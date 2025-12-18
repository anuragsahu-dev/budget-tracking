import type { CreateCategoryInput, UpdateCategoryInput } from "./category.validation";
export declare class CategoryService {
    static getAllCategories(userId: string, includeSystem?: boolean): Promise<{
        id: string;
        name: string;
        slug: string;
        color: string | null;
        isSystem: boolean;
        createdAt: Date;
    }[]>;
    static getCategoryById(categoryId: string, userId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        color: string | null;
        isSystem: boolean;
        createdAt: Date;
    }>;
    static createCategory(userId: string, data: CreateCategoryInput): Promise<{
        id: string;
        name: string;
        slug: string;
        color: string | null;
        isSystem: boolean;
        createdAt: Date;
    }>;
    static updateCategory(categoryId: string, userId: string, data: UpdateCategoryInput): Promise<{
        id: string;
        name: string;
        slug: string;
        color: string | null;
        isSystem: boolean;
        createdAt: Date;
    }>;
    static deleteCategory(categoryId: string, userId: string): Promise<{
        message: string;
    }>;
}
