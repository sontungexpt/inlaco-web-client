export const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export const isValidFileType = (file, accept) => {
  if (!accept || accept === "*") return true;
  return accept.split(",").some((rule) => {
    rule = rule.trim().toLowerCase();
    if (rule.endsWith("/*")) {
      return file.type.startsWith(rule.replace("/*", ""));
    }
    if (rule.startsWith(".")) {
      return file.name.toLowerCase().endsWith(rule);
    }
    return file.type === rule;
  });
};

export const normalize = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};
