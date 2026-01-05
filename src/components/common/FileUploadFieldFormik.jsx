import { Box, Typography, IconButton, Paper, Fade, Link } from "@mui/material";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import { useField, useFormikContext } from "formik";
import Color from "@constants/Color";
import { useMemo, useRef, useState } from "react";

/* ======================================================
 * Helpers
 * ====================================================== */

const FILE_ICON_MAP = [
  {
    match: [".pdf"],
    icon: PictureAsPdfRoundedIcon,
    color: "#E53935",
  },
  {
    match: [".xls", ".xlsx"],
    icon: TableChartRoundedIcon,
    color: "#2E7D32",
  },
  {
    match: [".doc", ".docx"],
    icon: DescriptionRoundedIcon,
    color: "#1565C0",
  },
];

const getFileIcon = (fileName = "") => {
  const name = fileName.toLowerCase();

  const found = FILE_ICON_MAP.find((f) =>
    f.match.some((ext) => name.endsWith(ext)),
  );

  if (!found) {
    return <DescriptionRoundedIcon sx={{ color: "text.secondary" }} />;
  }

  const Icon = found.icon;
  return <Icon sx={{ color: found.color }} />;
};

const formatSize = (bytes) => {
  if (!bytes) return "";
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatAcceptLabel = (accept = "") =>
  accept
    .split(",")
    .map((t) => t.replace(".", "").toUpperCase())
    .join(", ");

const formatSizeMB = (bytes) => `${Math.round(bytes / 1024 / 1024)}MB`;

const isValidFileType = (file, accept) => {
  if (!accept || accept === "*") return true;
  return accept.split(",").some((rule) => {
    rule = rule.trim().toLowerCase();
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule);
    if (rule.includes("/")) return file.type === rule;
    return false;
  });
};

/* ======================================================
 * Normalize (KHÔNG PHÁ API)
 * ====================================================== */

const normalizeValueToArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
};

const normalizeFile = (item) => {
  // File từ input
  if (item instanceof File) {
    return {
      name: item.name,
      size: item.size,
      type: item.type,
      file: item,
    };
  }

  // File từ initialValues (server)
  return {
    name: item.name,
    size: item.size,
    type: item.type || item.format,
    file: item.file,
    publicId: item.publicId,
    url: item.url,
  };
};

/* ======================================================
 * Component
 * ====================================================== */

const FileUploadFieldFormik = ({
  name,
  id,
  label,
  accept = ".doc,.docx,.pdf",
  maxSize = 5 * 1024 * 1024,

  error,
  helperText,

  invalidFormatText,
  invalidSizeText,
  required = false,
  disabled,
  multiple = false,
  sx = [],
  ...props
}) => {
  const { setFieldValue, setFieldTouched, setFieldError } = useFormikContext();
  const [field, meta] = useField(name);
  const showError =
    typeof error === "boolean" ? error : meta.touched && Boolean(meta.error);
  const finalHelperText = helperText !== undefined ? helperText : meta.error;

  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const files = useMemo(
    () => normalizeValueToArray(field.value).map(normalizeFile),
    [field.value],
  );

  const acceptLabel = useMemo(() => formatAcceptLabel(accept), [accept]);

  /* ---------------- handlers ---------------- */

  const handleFilesAdded = (fileList) => {
    if (!fileList || disabled) return;

    setFieldTouched(name, true, false);
    setFieldError(name, undefined);

    for (const file of fileList) {
      if (!isValidFileType(file, accept)) {
        setFieldError(
          name,
          typeof invalidFormatText == "function"
            ? invalidFormatText(file)
            : invalidFormatText ||
                `${file.name} không hợp lệ. Chỉ chấp nhận ${acceptLabel}`,
        );
        return;
      } else if (file.size > maxSize) {
        setFieldError(
          name,
          typeof invalidSizeText == "function"
            ? invalidSizeText(file)
            : invalidSizeText ||
                `Dung lượng ${file.name} tối đa ${formatSizeMB(maxSize)}`,
        );
        return;
      }
    }

    setFieldValue(name, multiple ? fileList : fileList[0], true);
  };

  const handleRemove = (index) => {
    setFieldTouched(name, true, false);

    if (!multiple) {
      setFieldValue(name, null, true);
      return;
    }

    const next = [...files];
    next.splice(index, 1);
    setFieldValue(name, next.length ? next : null, true);
  };

  const openFileDialog = () => {
    if (!disabled) inputRef.current?.click();
  };

  /* ---------------- render ---------------- */

  return (
    <Box
      {...props}
      sx={[
        { display: "flex", flexDirection: "column", gap: 0.75 },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {label && (
        <Typography fontSize={14} fontWeight={600}>
          {label}
          {required && (
            <Box component="span" color="error.main" ml={0.5}>
              *
            </Box>
          )}
        </Typography>
      )}

      <input
        hidden
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          handleFilesAdded(e.target.files);
          e.target.value = "";
        }}
      />

      <Paper
        elevation={0}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFilesAdded(e.dataTransfer.files);
        }}
        sx={{
          borderRadius: 2.5,
          border: "2px dashed",
          borderColor:
            meta.touched && meta.error
              ? "error.main"
              : dragOver
                ? "primary.main"
                : "divider",
          backgroundColor: dragOver
            ? "action.hover"
            : disabled
              ? "action.disabledBackground"
              : "background.paper",
        }}
        onClick={openFileDialog}
      >
        <Box p={2} textAlign="center">
          <UploadFileRoundedIcon
            sx={{ fontSize: 36, color: "primary.main", mb: 1 }}
          />
          <Typography fontWeight={500}>Kéo & thả file</Typography>
          <Typography variant="caption" color="text.secondary">
            hoặc click để chọn
          </Typography>
        </Box>
      </Paper>

      {/* File list */}
      {files.map((item, idx) => (
        <Fade in key={item.publicId || `${item.name}-${idx}`}>
          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              {getFileIcon(item.name || "")}

              <Box flex={1} minWidth={0}>
                <Typography noWrap fontSize={14}>
                  {item.url ? (
                    <Link href={item.url} target="_blank" underline="hover">
                      {item.name}
                    </Link>
                  ) : (
                    item.name
                  )}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {item.size ? formatSize(item.size) : "Đã upload"}
                </Typography>
              </Box>

              {!disabled && (
                <IconButton
                  onClick={() => handleRemove(idx)}
                  sx={{ color: Color.PrimaryOrgange }}
                >
                  <DeleteForeverRoundedIcon />
                </IconButton>
              )}
            </Box>
          </Paper>
        </Fade>
      ))}

      {showError && (
        <Typography
          variant="caption"
          color={showError ? "error" : "text.secondary"}
        >
          {finalHelperText}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploadFieldFormik;
