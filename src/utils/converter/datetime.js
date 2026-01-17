/**
 * Convert an ISO datetime string (UTC) into a local date/time string
 * based on a customizable format.
 *
 * Supported tokens:
 *  - dd   : day (01–31)
 *  - mm   : month (01–12)
 *  - yyyy : 4-digit year
 *  - HH   : hours (00–23)
 *  - MM   : minutes (00–59)
 *  - SS   : seconds (00–59)
 *
 * @param {string} isoString - ISO date string (e.g., "2025-11-30T06:15:00.000Z")
 * @param {string} [format="dd/mm/yyyy"] - Output format template
 * @returns {string|null} Formatted local date/time string or null if invalid
 *
 * @example
 * isoToLocalFormatted("2025-11-30T06:15:00.000Z", "dd/mm/yyyy");
 * // → "30/11/2025"
 *
 * @example
 * isoToLocalFormatted("2025-11-30T06:15:00.000Z", "dd/mm/yyyy HH:MM");
 * // → "30/11/2025 13:15"
 *
 * @example
 * isoToLocalFormatted("2025-11-30T06:15:00.000Z", "HH:MM:SS");
 * // → "13:15:00"
 */
export function isoToLocalDatetime(isoString, format = "dd/mm/yyyy HH:MM") {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) throw new Error("Invalid ISO string");

    const map = {
      dd: String(date.getDate()).padStart(2, "0"),
      mm: String(date.getMonth() + 1).padStart(2, "0"),
      yyyy: date.getFullYear(),
      HH: String(date.getHours()).padStart(2, "0"),
      MM: String(date.getMinutes()).padStart(2, "0"),
      SS: String(date.getSeconds()).padStart(2, "0"),
    };

    let output = format;
    for (const key of Object.keys(map)) {
      output = output.replace(key, map[key]);
    }

    return output;
  } catch (err) {
    console.error("ISO parse error:", err);
    return null;
  }
}

export function datetimeToISO(input) {
  try {
    if (!input) throw new Error("Empty date string");
    const normalized = String(input).trim().replace(/\s+/, "T");

    const [datePart, timePart = "00:00:00"] = normalized.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours = 0, minutes = 0, seconds = 0] = timePart
      .split(":")
      .map(Number);

    // Create as UTC to avoid timezone j
    const date = new Date(
      Date.UTC(year, month - 1, day, hours, minutes, seconds),
    );

    if (isNaN(date.getTime())) throw new Error("Invalid datetime");
    return date.toISOString();
  } catch (error) {
    console.error("Error converting to ISOString:", error);
    return null;
  }
}

export function dateToLocaleString(date, type = "datetime", locale = "vi-VN") {
  const map = {
    date: "toLocaleDateString",
    datetime: "toLocaleString",
    time: "toLocaleTimeString",
  };
  const dateObj = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(dateObj.getTime())) return "";
  return dateObj[map[type] || type](locale);
}

export function dateToMUIDatetime(date, type = "datetime-local") {
  if (!(date instanceof Date)) throw new Error("date must be Date type");
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  if (type === "date") {
    return `${yyyy}-${mm}-${dd}`;
  }

  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());

  if (type === "datetime-local") {
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  } else if (type === "time") {
    return `${hh}:${mi}`;
  }
  return "";
}

export function isoToMUIDateTime(value, type = "datetime-local") {
  if (!value) return value;
  const date = new Date(value);
  return dateToMUIDatetime(date, type);
}
