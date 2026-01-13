import { Box, Typography, IconButton, Paper, Fade, Link } from "@mui/material";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import { useMemo, useRef, useState } from "react";
import Color from "@constants/Color";
import { formatSize, isValidFileType, normalize } from "./helper";

/* ================= helpers ================= */

const FILE_ICON_MAP = [
  { match: [".pdf"], icon: PictureAsPdfRoundedIcon, color: "#E53935" },
  { match: [".xls", ".xlsx"], icon: TableChartRoundedIcon, color: "#2E7D32" },
  { match: [".doc", ".docx"], icon: DescriptionRoundedIcon, color: "#1565C0" },
];

const getFileIcon = (name = "") => {
  const lower = name.toLowerCase();
  const found = FILE_ICON_MAP.find((f) =>
    f.match.some((ext) => lower.endsWith(ext)),
  );

  if (!found) {
    return <DescriptionRoundedIcon sx={{ color: "text.secondary" }} />;
  }

  const Icon = found.icon;
  return <Icon sx={{ color: found.color }} />;
};

const normalizeFile = (item) => {
  if (item instanceof File) {
    return item;
  }

  return {
    ...item,
    file: item,
    name: item.name,
    size: item.size,
    type: item.format || item.type,
    url: item.url,
    publicId: item.publicId,
  };
};

/* ================= component ================= */

const FileUploadField = ({
  value,
  onChange,
  label,
  required,
  accept = ".doc,.docx,.pdf",
  maxFileSize = 5 * 1024 * 1024,
  multiple = false,
  disabled,
  error,
  helperText,
  sx = [],
}) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const files = useMemo(() => normalize(value).map(normalizeFile), [value]);
  const handleFilesAdded = (fileList) => {
    if (!fileList || disabled) return;
    const incoming = Array.from(fileList);
    if (!incoming.length) return;

    let err;
    for (const file of incoming) {
      if (!isValidFileType(file, accept)) {
        err = `${file.name} không đúng định dạng. Chỉ chấp nhận ${accept}`;
        break;
      } else if (file.size > maxFileSize) {
        err = `${file.name} vượt quá dung lượng cho phép`;
        break;
      }
    }
    if (err)
      onChange?.(null, {
        error: err,
      });

    const nextValue = multiple ? incoming : incoming[0];
    onChange?.(nextValue, {});
  };

  const handleRemove = (index) => {
    if (!multiple) {
      onChange?.(null, {});
      return;
    }

    const next = [...files];
    next.splice(index, 1);
    onChange?.(next.length ? next : null, {});
  };

  return (
    <Box
      sx={[
        { display: "flex", flexDirection: "column", gap: 0.75 },
        ...[].concat(sx),
      ]}
    >
      {label && (
        <Typography fontSize={14} fontWeight={600}>
          {label}
          {required && (
            <Box component="span" color="error.main">
              *
            </Box>
          )}
        </Typography>
      )}

      <input
        hidden
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
        onClick={() => !disabled && inputRef.current?.click()}
        sx={{
          borderRadius: 2.5,
          border: "2px dashed",
          borderColor: error
            ? "error.main"
            : dragOver
              ? "primary.main"
              : "divider",
          backgroundColor: dragOver ? "action.hover" : "background.paper",
        }}
      >
        <Box p={2} textAlign="center">
          <UploadFileRoundedIcon sx={{ fontSize: 36, color: "primary.main" }} />
          <Typography fontWeight={500}>Kéo & thả file</Typography>
          <Typography variant="caption" color="text.secondary">
            hoặc click để chọn
          </Typography>
        </Box>
      </Paper>

      {files.map((file, idx) => (
        <Fade in key={`${file.name}-${idx}`}>
          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              {getFileIcon(file.name)}
              <Box flex={1} minWidth={0}>
                <Typography noWrap fontSize={14}>
                  {file.url ? (
                    <Link href={file.url} target="_blank">
                      {file.name}
                    </Link>
                  ) : (
                    file.name
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {file.size ? formatSize(file.size) : "Đã upload"}
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

      {helperText && (
        <Typography
          variant="caption"
          color={error ? "error" : "text.secondary"}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploadField;
