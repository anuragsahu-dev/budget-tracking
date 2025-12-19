export interface CategorySelect {
    id: string;
    name: string;
    slug: string;
    color: string | null;
}
export interface BasePaginationOptions {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
}
export type CommonSortField = "createdAt" | "updatedAt";
