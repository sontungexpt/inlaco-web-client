type VNDFormatMode = "full" | "truncate";

/**
 * Format a number into Vietnamese currency format.
 *
 * Modes:
 * - "full":     10.000.000
 * - "truncate": 10,5   (represents 10.500 VND)
 *
 * @param value - Number or numeric string
 * @param mode  - Formatting mode (default: "full")
 * @returns Formatted VND string or empty string / null if invalid
 */
export function formatVND(
  value: number | string | null | undefined,
  mode: VNDFormatMode = "full",
  sep: string = ".",
): string | null {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const numericValue = parseInt(value as string, 10);

  if (Number.isNaN(numericValue)) return "";
  if (numericValue < 0) return null;

  // Special case: zero
  if (numericValue === 0) {
    return mode === "full" ? "0.000" : "0";
  }

  // ===== FULL FORMAT =====
  if (mode === "full") {
    return numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // ===== TRUNCATED FORMAT =====
  const thousands = Math.floor(numericValue / 1000);
  const remainder = numericValue % 1000;

  if (remainder === 0) {
    return `${thousands}`;
  }

  // Keep first digit only (truncate, not round)
  const truncated = Math.floor(remainder / 100);

  return `${thousands}${sep || ","}${truncated}`;
}
