/**
 * Format a number into Vietnamese currency format using dots as thousand separators.
 *
 * @param {number|string} value - The number to format. Accepts number or numeric string.
 * @returns {string} The formatted number string (e.g., "10.000.000").
 *
 * @example
 * formatVND(10000000);     // "10.000.000"
 * formatVND("250000");     // "250.000"
 * formatVND(0);            // "0.000"
 * formatVND(null);         // ""
 */
export function formatVND(value) {
  if (value === 0) {
    return "0.000"; // Special case for zero value
  }

  if (value) {
    const parts = value.toString().split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return integerPart;
  }

  return "";
}
