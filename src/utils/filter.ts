export const flattenFilter = (obj?: Record<string, any>, prefix = "filter") => {
  if (!obj || typeof obj !== "object") return {};
  const result: Record<string, any> = {};

  const walk = (current: Record<string, any>, path: string) => {
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
