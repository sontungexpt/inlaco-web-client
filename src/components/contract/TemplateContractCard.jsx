import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  IconButton,
  Grid,
  Dialog,
  Box,
} from "@mui/material";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import { useState } from "react";
import Color from "@constants/Color";

const TemplateContractCard = ({
  image,
  title,
  type,
  templateUrl, // 👈 URL file DOCX
  gridSize = 4,
  color = Color.PrimaryBlack,
  sx = [],
}) => {
  const [imageError, setImageError] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const handleOpenPreview = () => {
    if (!templateUrl) return;
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const downloadByBlob = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();

    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  };
  const handleDownload = async (e) => {
    e.stopPropagation(); // ❗ không trigger preview
    await downloadByBlob(templateUrl, `${title}.docx`);
    // window.open(templateUrl, "_blank");
  };

  return (
    <>
      <Grid size={gridSize} sx={[...(Array.isArray(sx) ? sx : [sx])]}>
        <Card
          onClick={handleOpenPreview}
          sx={{
            position: "relative",
            borderRadius: 4,
            overflow: "hidden",
            height: "100%",
            transition: "all 0.25s ease",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            "&:hover": {
              cursor: "pointer",
              transform: "translateY(-6px)",
              boxShadow: "0 14px 40px rgba(0,0,0,0.18)",
            },
          }}
        >
          {/* Download Button */}
          <IconButton
            aria-label="download"
            onClick={handleDownload}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 2,
              backgroundColor: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 6px 10px rgba(0,0,0,0.3)",
              "&:hover": {
                backgroundColor: "#fff",
              },
            }}
          >
            <DownloadForOfflineRoundedIcon
              sx={{ width: 26, height: 26, color: Color.PrimaryGray }}
            />
          </IconButton>

          {/* Image */}
          <CardMedia
            component="img"
            height="200"
            image={
              imageError || !image
                ? require("../../assets/images/no-ship-photo.png")
                : image
            }
            alt={title}
            onError={() => setImageError(true)}
            sx={{
              p: 2,
              objectFit: "cover",
              transition: "transform 0.3s ease",
              ".MuiCard-root:hover &": {
                transform: "scale(1.05)",
              },
            }}
          />

          {/* Content */}
          <CardContent sx={{ p: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color,
                mb: 0.5,
                display: "-webkit-box",
                overflow: "hidden",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: Color.SecondaryBlack, fontSize: 14 }}
            >
              <strong>Loại:</strong> {type}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* ===== PREVIEW MODAL ===== */}
      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
        fullWidth
        maxWidth="lg"
      >
        <Box sx={{ width: "100%", height: "80vh" }}>
          <iframe
            title="template-preview"
            src={`https://docs.google.com/gview?url=${encodeURIComponent(
              templateUrl,
            )}&embedded=true`}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </Box>
      </Dialog>
    </>
  );
};

export default TemplateContractCard;
