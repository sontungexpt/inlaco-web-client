import { Box, Typography, IconButton, Paper, Fade, Link } from "@mui/material";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import { ReactNode, useMemo, useRef, useState } from "react";
import { SxProps, Theme } from "@mui/material/styles";

import Color from "@constants/Color";
import { formatSize, isValidFileType, normalize } from "./helper";

/* ================= types ================= */

type UploadedFile = {
  file?: File;
  name: string;
  size?: number;
  type?: string;
  format?: string;
  url?: string;
  publicId?: string;
};

type FileItem = File | UploadedFile;

type ChangeMeta = {
  error?: string;
};

type FileUploadFieldProps = {
  value?: FileItem | FileItem[] | null;
  onChange?: (
    value: File | File[] | UploadedFile | UploadedFile[] | null,
    meta: ChangeMeta,
  ) => void;
  label?: string;
  required?: boolean;
  accept?: string;
  maxFileSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme> | SxProps<Theme>[];
};

/* ================= helpers ================= */

type FileIconConfig = {
  match: string[];
  icon: typeof PictureAsPdfRoundedIcon;
  color: string;
};

const FILE_ICON_MAP: FileIconConfig[] = [
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

const getFileIcon = (name = ""): ReactNode => {
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

const normalizeFile = (item: FileItem): UploadedFile | File => {
  if (item instanceof File) {
    return item;
  }

  return {
    ...item,
    file: item.file,
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
}: FileUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [dragOver, setDragOver] = useState(false);

  const files = useMemo<(UploadedFile | File)[]>(() => {
    if (!value) return [];

    return normalize(value).map(normalizeFile);
  }, [value]);

  const handleFilesAdded = (fileList: FileList | null) => {
    if (!fileList || disabled) return;

    const incoming = Array.from(fileList);

    if (!incoming.length) return;

    let err: string | undefined;

    for (const file of incoming) {
      if (!isValidFileType(file, accept)) {
        err = `${file.name} không đúng định dạng. Chỉ chấp nhận ${accept}`;
        break;
      }

      if (file.size > maxFileSize) {
        err = `${file.name} vượt quá dung lượng cho phép`;
        break;
      }
    }

    if (err) {
      onChange?.(null, {
        error: err,
      });

      return;
    }

    const nextValue = multiple ? incoming : incoming[0];

    onChange?.(nextValue, {});
  };

  const handleRemove = (index: number) => {
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
        {
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
        },
        ...[].concat(sx as never),
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
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <Box p={2} textAlign="center">
          <UploadFileRoundedIcon
            sx={{
              fontSize: 36,
              color: "primary.main",
            }}
          />

          <Typography fontWeight={500}>Kéo & thả file</Typography>

          <Typography variant="caption" color="text.secondary">
            hoặc click để chọn
          </Typography>
        </Box>
      </Paper>

      {files.map((file, idx) => {
        const fileName = file instanceof File ? file.name : file.name;

        const fileUrl = file instanceof File ? undefined : file.url;

        const fileSize = file instanceof File ? file.size : file.size;

        return (
          <Fade in key={`${fileName}-${idx}`}>
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: 2,
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                {getFileIcon(fileName)}

                <Box flex={1} minWidth={0}>
                  <Typography noWrap fontSize={14}>
                    {fileUrl ? (
                      <Link
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {fileName}
                      </Link>
                    ) : (
                      fileName
                    )}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {fileSize ? formatSize(fileSize) : "Đã upload"}
                  </Typography>
                </Box>

                {!disabled && (
                  <IconButton
                    onClick={() => handleRemove(idx)}
                    sx={{
                      color: Color.PrimaryOrgange,
                    }}
                  >
                    <DeleteForeverRoundedIcon />
                  </IconButton>
                )}
              </Box>
            </Paper>
          </Fade>
        );
      })}

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
