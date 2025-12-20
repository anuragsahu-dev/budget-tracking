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
