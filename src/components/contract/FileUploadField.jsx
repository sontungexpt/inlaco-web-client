import {
  Box,
  Button,
  Typography,
  IconButton,
  Paper,
  Fade,
} from "@mui/material";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import { useField, useFormikContext } from "formik";
import Color from "@constants/Color";
import { useState, useMemo } from "react";

/* ---------- helpers ---------- */

const getFileIcon = (fileName) => {
  if (!fileName) return <DescriptionRoundedIcon />;
  if (fileName.endsWith(".pdf")) return <PictureAsPdfRoundedIcon />;
  if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx"))
    return <TableChartRoundedIcon />;
  return <DescriptionRoundedIcon />;
};

const formatSize = (bytes) => {
  if (!bytes) return "";
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatAcceptLabel = (accept) => {
  if (!accept) return "";
  return accept
    .split(",")
    .map((t) => t.replace(".", "").toUpperCase())
    .join(", ");
};

/* ---------- component ---------- */

const FileUploadField = ({
  name,
  id,
  label,
  accept = ".doc,.docx,.pdf",
  helperText,
  required = false,
  disabled,
  sx = [],
  ...props
}) => {
  const { setFieldValue, setFieldTouched, validateField } = useFormikContext();
  const [field, meta] = useField(name);
  const [dragOver, setDragOver] = useState(false);
  const inputId = id || `file-upload-${name}`;

  const acceptLabel = useMemo(() => formatAcceptLabel(accept), [accept]);

  const handleFileChanged = (file) => {
    if (!file) return;
    setFieldTouched(name, true, false);
    setFieldValue(name, file, true);
  };

  const handleFileDialogOpened = () => {
    if (disabled) return;
    setFieldTouched(name, true, false);
    setFieldValue(name, field.value ?? null, true);
    document.getElementById(inputId).click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    handleFileChanged(e.dataTransfer.files[0]);
  };

  const handleDelete = () => {
    setFieldTouched(name, true, false);
    setFieldValue(name, null, true);
  };

  return (
    <Box
      {...props}
      sx={[
        {
          width: "100%",
          maxWidth: 560,
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Label */}
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

      {/* Upload box */}
      <Paper
        elevation={0}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        sx={{
          p: 2,
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
          transition: "all 0.25s ease",
        }}
      >
        {!field.value ? (
          <>
            <input
              hidden
              type="file"
              accept={accept}
              disabled={disabled}
              id={inputId}
              onChange={(e) => {
                handleFileChanged(e.target.files[0]);
                e.target.value = "";
              }}
            />

            <Box textAlign="center">
              <UploadFileRoundedIcon
                sx={{ fontSize: 36, color: "primary.main", mb: 1 }}
              />
              <Typography fontWeight={500}>Kéo & thả file vào đây</Typography>
              <Typography variant="caption" color="text.secondary">
                hoặc
              </Typography>
              <Box mt={1}>
                <Button
                  size="small"
                  variant="contained"
                  disabled={disabled}
                  onClick={handleFileDialogOpened}
                >
                  Chọn file
                </Button>
              </Box>
              {(acceptLabel || helperText) && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={1}
                >
                  {acceptLabel}
                  {acceptLabel && helperText ? " • " : ""}
                  {helperText}
                </Typography>
              )}
            </Box>
          </>
        ) : (
          <Fade in>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box color="primary.main">{getFileIcon(field.value.name)}</Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontSize={14} noWrap>
                  {field.value.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatSize(field.value.size)}
                </Typography>
              </Box>

              {!disabled && (
                <IconButton
                  onClick={handleDelete}
                  sx={{
                    color: Color.PrimaryOrgange,
                    "&:hover": {
                      backgroundColor: "rgba(255,152,0,0.12)",
                    },
                  }}
                >
                  <DeleteForeverRoundedIcon />
                </IconButton>
              )}
            </Box>
          </Fade>
        )}
      </Paper>

      {/* Error */}
      {meta.touched && meta.error && (
        <Typography variant="caption" color="error">
          {meta.error}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploadField;
