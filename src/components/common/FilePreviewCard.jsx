import React from "react";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import Color from "@constants/Color";

/* ------------------ helpers ------------------ */

const getFileMeta = (url) => {
  if (!url) return { icon: DescriptionRoundedIcon, color: "text.secondary" };
  if (url.endsWith(".pdf"))
    return { icon: PictureAsPdfRoundedIcon, color: "error.main" };

  return { icon: DescriptionRoundedIcon, color: "primary.main" };
};

const defaultDownload = async (url, filename = "file") => {
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
}) {
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
// import React from "react";
// import { Box, Paper, Typography, Button } from "@mui/material";
// import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
// import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
// import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
// import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
// import Color from "@constants/Color";

// const getFileIcon = (url) => {
//   if (!url) return <DescriptionRoundedIcon />;
//   else if (url.endsWith(".pdf")) return <PictureAsPdfRoundedIcon />;
//   return <DescriptionRoundedIcon />;
// };

// const handleDownload = async (url, filename = "file") => {
//   try {
//     const response = await fetch(url);
//     const blob = await response.blob();

//     const blobUrl = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = blobUrl;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();

//     a.remove();
//     window.URL.revokeObjectURL(blobUrl);
//   } catch (err) {
//     console.error("Download failed", err);
//   }
// };

// const FilePreviewCard = ({
//   url,
//   emptyText,
//   sx,
//   name = "Tệp đính kèm",
//   label = "Tài liệu",
// }) => {
//   if (!url) {
//     return (
//       <Typography color="text.secondary">
//         {emptyText || `Không có ${label.toLowerCase()}`}
//       </Typography>
//     );
//   }

//   const handlePreview = (e) => {
//     e.stopPropagation();
//     window.open(url, "_blank");
//   };

//   return (
//     <Paper
//       variant="outlined"
//       onClick={handlePreview}
//       sx={[
//         {
//           p: 2,
//           borderRadius: 2,
//           display: "flex",
//           alignItems: "center",
//           gap: 2,
//           borderStyle: "solid",
//           borderColor: Color.PrimaryBlue,
//           ":hover": {
//             cursor: "pointer",
//             backgroundColor: "#F5F5F5",
//           },
//         },
//         ...(Array.isArray(sx) ? sx : [sx]),
//       ]}
//     >
//       <Box sx={{ color: Color.PrimaryBlue }}>{getFileIcon(url)}</Box>

//       <Box sx={{ flex: 1, minWidth: 0 }}>
//         <Typography fontWeight={600} noWrap>
//           {name}
//         </Typography>
//         <Typography variant="caption" color="text.secondary">
//           {label}
//         </Typography>
//       </Box>

//       <Button
//         size="small"
//         startIcon={<OpenInNewRoundedIcon />}
//         onClick={handlePreview}
//       >
//         Xem
//       </Button>

//       <Button
//         size="small"
//         startIcon={<DownloadRoundedIcon />}
//         onClick={() => handleDownload(url, name)}
//       >
//         Tải
//       </Button>
//     </Paper>
//   );
// };

// export default FilePreviewCard;
