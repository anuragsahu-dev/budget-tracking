/**
 * Common Types - Shared across multiple modules
 */

// ==================== CATEGORY ====================

/**
 * Lightweight category select for relations
 * Used in: transaction, budget modules
 */
export interface CategorySelect {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

// ==================== PAGINATION ====================

/**
 * Base pagination options - extend for module-specific sorting
 */
export interface BasePaginationOptions {
  page: number;
  limit: number;
  sortOrder: "asc" | "desc";
}

/**
 * Common sort fields used across modules
 */
export type CommonSortField = "createdAt" | "updatedAt";
