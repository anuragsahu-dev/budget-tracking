/**
 * Currency utilities
 * Supports: INR, USD (as per PlanPricing schema)
 */

// Supported currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
};

/**
 * Get currency symbol from currency code
 * @param currency - 3-letter currency code (INR or USD)
 * @returns Currency symbol or the code itself if not found
 */
export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency.toUpperCase()] || currency;
}

/**
 * Format amount with currency symbol
 * @param amount - Amount to format
 * @param currency - 3-letter currency code (INR or USD)
 * @returns Formatted string like "₹299.00" or "$9.99"
 */
export function formatCurrency(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toFixed(2)}`;
}
