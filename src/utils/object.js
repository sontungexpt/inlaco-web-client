export function keepChangedFields(oldVal, newVal) {
  // 1. giống hệt (primitive / reference)
  if (oldVal === newVal) return undefined;

  // 2. field bị xoá
  if (oldVal !== undefined && newVal === undefined) {
    return null;
  }

  // 3. primitive / null
  if (
    typeof oldVal !== "object" ||
    typeof newVal !== "object" ||
    oldVal === null ||
    newVal === null
  ) {
    return newVal;
  }

  // 4. File: luôn replace
  if (newVal instanceof File) {
    return newVal;
  }

  // 5. Array: replace toàn bộ nếu khác
  if (Array.isArray(oldVal) || Array.isArray(newVal)) {
    if (
      Array.isArray(oldVal) &&
      Array.isArray(newVal) &&
      oldVal.length === newVal.length &&
      oldVal.every((v, i) => v === newVal[i])
    ) {
      return undefined;
    }
    return newVal;
  }

  // 6. Object: merge đệ quy
  const result = {};
  let hasChange = false;

  const keys = new Set([
    ...Object.keys(oldVal || {}),
    ...Object.keys(newVal || {}),
  ]);

  for (const key of keys) {
    const diff = keepChangedFields(oldVal?.[key], newVal?.[key]);

    if (diff !== undefined) {
      result[key] = diff;
      hasChange = true;
    }
  }

  return hasChange ? result : undefined;
}

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
