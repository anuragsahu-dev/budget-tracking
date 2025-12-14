/**
 * Generates a URL-friendly slug from a string.
 *
 * Examples:
 *  - "Anurag Sahu" -> "anurag-sahu"
 *  - "Food & Drinks" -> "food-drinks"
 *  - "  Multiple   Spaces  " -> "multiple-spaces"
 *  - "Café & Résumé" -> "cafe-resume"
 *
 * @param text - The input string to slugify
 * @returns A lowercase, hyphen-separated slug
 */
export function generateSlug(text: string): string {
  return text
    .normalize("NFD") // Normalize unicode characters (é -> e + combining accent)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks (accents)
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric chars except spaces and hyphens
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}
