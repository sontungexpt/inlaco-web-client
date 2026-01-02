import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import Color from "@constants/Color";

const getFileIcon = (url) => {
  if (!url) return <DescriptionRoundedIcon />;
  else if (url.endsWith(".pdf")) return <PictureAsPdfRoundedIcon />;
  return <DescriptionRoundedIcon />;
};

const FilePreviewCard = ({
  url,
  emptyText,
  name = "Tệp đính kèm",
  label = "Tài liệu",
}) => {
  const handleDownload = async (url, filename = "file") => {
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
  if (!url) {
    return (
      <Typography color="text.secondary">
        {emptyText || `Không có ${label.toLowerCase()}`}
      </Typography>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderStyle: "dashed",
      }}
    >
      <Box sx={{ color: Color.PrimaryBlue }}>{getFileIcon(url)}</Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography fontWeight={600} noWrap>
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Box>

      <Button
        size="small"
        startIcon={<OpenInNewRoundedIcon />}
        onClick={() => window.open(url, "_blank")}
      >
        Xem
      </Button>

      <Button
        size="small"
        startIcon={<DownloadRoundedIcon />}
        onClick={() => handleDownload(url, name)}
      >
        Tải
      </Button>
    </Paper>
  );
};

export default FilePreviewCard;
