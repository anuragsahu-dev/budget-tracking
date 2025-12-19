import { Prisma, Category } from "../../generated/prisma/client";
import { RepositoryResult } from "../../utils/repository.utils";
export declare class CategoryRepository {
    static findAllByUser(userId: string, includeSystem?: boolean): Promise<Category[]>;
    static findById(id: string): Promise<Category | null>;
    static findSystemCategoryBySlug(slug: string): Promise<Category | null>;
    static findBySlugAndUser(slug: string, userId: string): Promise<Category | null>;
    static create(data: Prisma.CategoryCreateInput): Promise<RepositoryResult<Category>>;
    static update(id: string, data: Prisma.CategoryUpdateInput): Promise<RepositoryResult<Category>>;
    static delete(id: string): Promise<RepositoryResult<Category>>;
    static hasTransactions(categoryId: string): Promise<boolean>;
    static hasBudgetAllocations(categoryId: string): Promise<boolean>;
}
