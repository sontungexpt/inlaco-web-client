export const formatSize = (bytes: number): string =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export const isValidFileType = (file: File, accept?: string): boolean => {
  if (!accept || accept === "*") {
    return true;
  }

  return accept.split(",").some((rule) => {
    const normalizedRule = rule.trim().toLowerCase();

    if (normalizedRule.endsWith("/*")) {
      return file.type.startsWith(normalizedRule.replace("/*", ""));
    }

    if (normalizedRule.startsWith(".")) {
      return file.name.toLowerCase().endsWith(normalizedRule);
    }

    return file.type === normalizedRule;
  });
};

export const normalize = <T>(value?: T | T[] | null): T[] => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};
