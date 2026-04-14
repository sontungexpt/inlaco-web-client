import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  PaperProps,
} from "@mui/material";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import Color from "@constants/Color";

/* ------------------ helpers ------------------ */

const getFileMeta = (url: string) => {
  if (!url) return { icon: DescriptionRoundedIcon, color: "text.secondary" };
  if (url.endsWith(".pdf"))
    return { icon: PictureAsPdfRoundedIcon, color: "error.main" };

  return { icon: DescriptionRoundedIcon, color: "primary.main" };
};

const defaultDownload = async (url: string, filename: string = "file") => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Download failed", err);
  }
};

/* ------------------ component ------------------ */
export type FilePreviewCardProps = {
  url: string;
  name?: string;
  label?: string;
  emptyText?: string;
  variant?: "outlined" | "soft";
  showActions?: boolean;
  onPreview?: (url: string) => void;
  onDownload?: (url: string, filename?: string) => void;
  sx?: PaperProps["sx"];
};

export default function FilePreviewCard({
  url,
  name = "Tệp đính kèm",
  label = "Tài liệu",
  emptyText,
  variant = "outlined", // outlined | soft
  showActions = true,
  onPreview,
  onDownload,
  sx,
}: FilePreviewCardProps) {
  if (!url) {
    return (
      <Typography color="text.secondary">
        {emptyText || `Không có ${label.toLowerCase()}`}
      </Typography>
    );
  }

  const { icon: Icon, color } = getFileMeta(url);

  const handlePreview = () =>
    onPreview ? onPreview(url) : window.open(url, "_blank");

  const handleDownload = () =>
    onDownload ? onDownload(url, name) : defaultDownload(url, name);

  return (
    <Paper
      variant={variant === "outlined" ? "outlined" : undefined}
      onClick={!showActions ? handlePreview : undefined}
      sx={[
        {
          p: 2,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: variant === "soft" ? "#F8FAFF" : "background.paper",
          borderColor: Color.PrimaryBlue,
        },
        !showActions && {
          ":hover": {
            cursor: "pointer",
            backgroundColor: "#F5F5F5",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 1.5,
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
        }}
      >
        <Icon />
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography fontWeight={600} noWrap>
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Box>

      {/* Actions */}
      {showActions && (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            startIcon={<OpenInNewRoundedIcon />}
            onClick={handlePreview}
          >
            Xem
          </Button>

          <Button
            size="small"
            startIcon={<DownloadRoundedIcon />}
            onClick={handleDownload}
          >
            Tải
          </Button>
        </Stack>
      )}
    </Paper>
  );
}
