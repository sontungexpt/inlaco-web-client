export const flattenFilter = (obj, prefix = "filter") => {
  if (!obj || typeof obj !== "object") return {};
  const result = {};
  const walk = (current, path) => {
    Object.entries(current).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      const fullKey = path ? `${path}.${key}` : key;

      // Array → multi-value param
      if (Array.isArray(value)) {
        result[fullKey] = value;
        return;
      }
      // Nested object
      if (typeof value === "object") {
        walk(value, fullKey);
        return;
      }

      // Primitive
      result[fullKey] = value;
    });
  };

  walk(obj, prefix);
  return result;
};

export function stableFilterKey(filter) {
  if (!filter || typeof filter !== "object") return [];

  const result = [];
  const keys = Object.keys(filter).sort();

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = filter[key];

    // ❌ bỏ rỗng
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      continue;
    }

    // ✅ Array → sort + primitive only
    if (Array.isArray(value)) {
      const arr = value
        .filter((v) => v !== null && v !== undefined && v !== "")
        .slice()
        .sort();

      for (let j = 0; j < arr.length; j++) {
        result.push(key, arr[j]);
      }
      continue;
    }

    // ✅ Object (nested)
    if (typeof value === "object" && !(value instanceof Date)) {
      const nested = stableFilterKey(value);
      for (let j = 0; j < nested.length; j += 2) {
        result.push(key + "." + nested[j], nested[j + 1]);
      }
      continue;
    }

    // ✅ Primitive (normalize)
    result.push(key, normalizeValue(value));
  }

  return result;
}

function normalizeValue(value) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "boolean") return value ? 1 : 0;
  return value;
}
