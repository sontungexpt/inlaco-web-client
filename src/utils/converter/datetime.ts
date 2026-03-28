export type DateFormat = string;

export type LocaleType = "date" | "datetime" | "time";

export type MUIType = "date" | "datetime-local" | "time";

/**
 * Convert ISO string (UTC) → formatted local datetime string
 */
export function isoToDatetime(
  isoString: string,
  format: DateFormat = "dd/mm/yyyy HH:MM",
): string | null {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) throw new Error("Invalid ISO string");

    const map: Record<string, string> = {
      dd: String(date.getDate()).padStart(2, "0"),
      mm: String(date.getMonth() + 1).padStart(2, "0"),
      yyyy: String(date.getFullYear()),
      HH: String(date.getHours()).padStart(2, "0"),
      MM: String(date.getMinutes()).padStart(2, "0"),
      SS: String(date.getSeconds()).padStart(2, "0"),
    };

    let output = format;

    // replace ALL occurrences (fix bug)
    for (const key of Object.keys(map)) {
      output = output.replace(new RegExp(key, "g"), map[key]);
    }

    return output;
  } catch (err) {
    console.error("ISO parse error:", err);
    return null;
  }
}

/**
 * Convert "yyyy-mm-dd HH:mm:ss" → ISO string (UTC)
 */
export function datetimeToISO(input: string): string | null {
  try {
    if (!input) throw new Error("Empty date string");

    const normalized = input.trim().replace(/\s+/, "T");

    const [datePart, timePart = "00:00:00"] = normalized.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours = 0, minutes = 0, seconds = 0] = timePart
      .split(":")
      .map(Number);

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

/**
 * Convert Date → localized string
 */
export function dateToLocaleString(
  date: string | Date,
  type: LocaleType = "datetime",
  locale: string = "vi-VN",
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(dateObj.getTime())) return "";

  if (type === "date") return dateObj.toLocaleDateString(locale);
  else if (type === "time") return dateObj.toLocaleTimeString(locale);
  else if (type === "datetime") return dateObj.toLocaleString(locale);

  const method = (dateObj as any)[type];
  if (typeof method === "function") {
    return method.call(dateObj, locale);
  }

  return "";
}

/**
 * Convert Date or ISO → MUI input format
 */
export function dateToMUIDatetime(
  date: Date | string,
  type: MUIType = "datetime-local",
): string {
  if (!date) return date;
  if (typeof date === "string") {
    date = new Date(date);
  }
  if (!(date instanceof Date)) {
    throw new Error("date must be Date type");
  }

  if (Number.isNaN(date.getTime())) return "";

  const pad = (n: number): string => String(n).padStart(2, "0");

  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());

  if (type === "date") {
    return `${yyyy}-${MM}-${dd}`;
  }

  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());

  if (type === "datetime-local") {
    return `${yyyy}-${MM}-${dd}T${hh}:${mi}`;
  }

  if (type === "time") {
    return `${hh}:${mi}`;
  }

  return "";
}
