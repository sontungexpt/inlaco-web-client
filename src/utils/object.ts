export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? DeepPartial<U>[]
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

type Options = {
  keepPaths?: string[];
};

function keepChangedFieldsInternal<T>(
  oldVal: T,
  newVal: T,
  options: Options = {},
  path = "",
): DeepPartial<T> | undefined | null {
  const keepPaths = new Set(options.keepPaths ?? []);

  function shouldKeepPath(currentPath: string): boolean {
    return [...keepPaths].some((p) => {
      const regex = new RegExp("^" + p.replace(/\[\]/g, "\\[\\d+\\]") + "$");
      return regex.test(currentPath);
    });
  }

  // ========================
  // NULL / UNDEFINED HANDLING
  // ========================
  if (oldVal !== undefined && newVal === undefined) {
    return null;
  }

  // ========================
  // PRIMITIVE OR STRICT EQUAL
  // ========================
  const isObject =
    oldVal !== null &&
    typeof oldVal === "object" &&
    newVal !== null &&
    typeof newVal === "object";

  if (!isObject) {
    if (oldVal === newVal) return undefined;
    return newVal as DeepPartial<T>;
  }

  // ========================
  // FILE OVERRIDE
  // ========================
  if (newVal instanceof File) {
    return newVal as DeepPartial<T>;
  }

  // ========================
  // ARRAY HANDLING (REPLACE STRATEGY)
  // ========================
  if (Array.isArray(oldVal) || Array.isArray(newVal)) {
    if (
      Array.isArray(oldVal) &&
      Array.isArray(newVal) &&
      oldVal.length === newVal.length &&
      oldVal.every((v, i) => v === newVal[i])
    ) {
      return undefined;
    }

    return newVal as DeepPartial<T>;
  }

  // ========================
  // OBJECT DIFF
  // ========================
  const result: any = {};
  let hasChange = false;

  const keys = new Set([
    ...Object.keys(oldVal ?? {}),
    ...Object.keys(newVal ?? {}),
  ]) as Set<string>;

  for (const key of keys) {
    const currentPath = path ? `${path}.${key}` : key;

    const isKept = shouldKeepPath(currentPath);

    const diff = keepChangedFieldsInternal(
      (oldVal as any)?.[key],
      (newVal as any)?.[key],
      options,
      currentPath,
    );

    // ========================
    // KEEP PATH OVERRIDE (HIGHEST PRIORITY)
    // ========================
    if (isKept) {
      result[key] = (newVal as any)?.[key];
      hasChange = true;
      continue;
    }

    if (diff !== undefined) {
      result[key] = diff;
      hasChange = true;
    }
  }

  // ========================
  // FINAL RESULT
  // ========================
  return hasChange ? (result as DeepPartial<T>) : undefined;
}

export function keepChangedFields<T>(
  oldVal: T,
  newVal: T,
  options: Options = {},
): DeepPartial<T> | undefined | null {
  return keepChangedFieldsInternal(oldVal, newVal, options);
}
