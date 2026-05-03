import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  IconButton,
  Grid,
  Dialog,
  Box,
  CircularProgress,
  GridProps,
} from "@mui/material";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useState } from "react";
import Color from "@constants/Color";
import toast from "react-hot-toast";
import { downloadDocxFromTemplate } from "@/utils/download";
import NoShipPhoto from "@assets/images/no-ship-photo.png";

export type TemplateContractCardProps = {
  image?: string;
  title?: string;
  type?: string;
  url?: string;
  gridSize?: number;
  initialData?: any;
  dowloadFileName?: string;
  color?: string;
  sx?: GridProps["sx"];
  showDelete?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
  onDownload?: () => void;
};

const TemplateContractCard = ({
  image,
  title,
  type,
  url,
  gridSize = 4,
  initialData = {},
  dowloadFileName,
  color = Color.PrimaryBlack,
  sx = [],
  showDelete = false,
  onDelete,
  isDeleting = false,
  onDownload,
}: TemplateContractCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const handleOpenPreview = () => {
    if (!url) return;
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const handleDownload = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    if (onDownload) {
      onDownload();
      return;
    }

    try {
      await downloadDocxFromTemplate({
        url: url as string,
        data: initialData,
        fileName: dowloadFileName || `template_${Date.now()}.docx`,
      });
    } catch (err) {
      console.debug(err);
      toast.error("Download file thất bại");
    }
  };

  return (
    <>
      <Grid size={gridSize} sx={sx}>
        <Card
          onClick={handleOpenPreview}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            height: "100%",
            background: "#fff",
            transition: "all 0.25s ease",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: "0 16px 45px rgba(0,0,0,0.18)",
              "& .action-overlay": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          {/* ===== IMAGE + ACTIONS ===== */}
          <Box p={2} sx={{ position: "relative" }}>
            <CardMedia
              height={180}
              component="img"
              image={imageError || !image ? NoShipPhoto : image}
              alt={title}
              onError={() => setImageError(true)}
              sx={{ objectFit: "cover", filter: "brightness(0.95)" }}
            />

            {/* ACTION OVERLAY */}
            <Box
              className="action-overlay"
              onClick={(e) => e.stopPropagation()}
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.15))",
                opacity: 0,
                transform: "translateY(10px)",
                transition: "all 0.25s ease",
              }}
            >
              <IconButton
                onClick={handleDownload}
                sx={{
                  backgroundColor: "#fff",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <DownloadForOfflineRoundedIcon />
              </IconButton>

              {/* Delete */}
              {showDelete &&
                (isDeleting ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  <IconButton
                    onClick={() => onDelete?.()}
                    sx={{
                      backgroundColor: "#ff4d4f",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#ff7875" },
                    }}
                  >
                    <DeleteForeverRoundedIcon />
                  </IconButton>
                ))}
            </Box>
          </Box>

          <CardContent sx={{ p: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color,
                mb: 0.5,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </Typography>

            <Typography variant="caption" sx={{ color: Color.SecondaryBlack }}>
              {type}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
        fullWidth
        maxWidth="lg"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1,
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>
            {title || "Xem trước tài liệu"}
          </Typography>

          <IconButton onClick={handleClosePreview}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Box sx={{ width: "100%", height: "90vh" }}>
          <iframe
            title="template-preview"
            src={`https://docs.google.com/gview?url=${encodeURIComponent(
              url as string,
            )}&embedded=true`}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </Box>
      </Dialog>
    </>
  );
};

export default TemplateContractCard;
