import React from "react";
import { Grid, Card, Box, Typography, Button } from "@mui/material";
import Color from "@constants/Color";

const RecruitmentCard = ({
  isAdmin,
  title,
  description,
  location,
  startDate,
  endDate,
  gridSize = 12,
  sx = [],
  onClick,
  isExpired,
  onApplyNow,
  onViewDetail,
  ...props
}) => {
  const expired = !isAdmin && isExpired;
  return (
    <Grid
      {...props}
      onClick={onClick}
      size={gridSize}
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Card
        sx={{
          borderRadius: 4,
          p: 3,
          minHeight: 240,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "background.paper",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          transition: "all 0.25s ease",
          "&:hover": {
            cursor: "pointer",
            transform: "translateY(-6px)",
            boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
          },
        }}
      >
        {/* ---------- Content ---------- */}
        <Box>
          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: Color.PrimaryBlack,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              mb: 0.5,
            }}
          >
            {title}
          </Typography>

          {/* Status badge */}
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Box
              sx={{
                px: 1.2,
                py: 0.3,
                borderRadius: 2,
                fontSize: 12,
                fontWeight: 600,
                backgroundColor: expired
                  ? "rgba(211,47,47,0.1)"
                  : "rgba(46,125,50,0.1)",
                color: expired ? "error.main" : "success.main",
              }}
            >
              {expired ? "Đã đóng" : "Đang tuyển"}
            </Box>
          </Box>

          {/* Date range */}
          {(startDate || endDate) && (
            <Typography
              variant="caption"
              sx={{
                color: Color.SecondaryBlack,
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                mb: 1,
              }}
            >
              <span style={{ fontSize: 14 }}>📅</span>
              <strong>
                {startDate} – {endDate}
              </strong>
            </Typography>
          )}

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: Color.SecondaryBlack,
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
            }}
          >
            {description}
          </Typography>
        </Box>

        {/* ---------- Action ---------- */}
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            disabled={expired}
            onClick={(e) => {
              e.stopPropagation();
              if (isAdmin) onViewDetail(e);
              else onApplyNow(e);
            }}
            variant="contained"
            sx={{
              backgroundColor: expired
                ? "action.disabledBackground"
                : Color.SecondaryBlue,
              color: expired ? "text.disabled" : "#fff",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: expired
                  ? "action.disabledBackground"
                  : Color.SecondaryBlue,
                opacity: expired ? 1 : 0.9,
              },
            }}
          >
            {isAdmin ? "Xem chi tiết" : "Ứng tuyển ngay"}
          </Button>
        </Box>
      </Card>
    </Grid>
  );
};

export default RecruitmentCard;
