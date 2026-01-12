import React, {} from "react";
import { Box, Typography } from "@mui/material";

export default function InfoItem({
  label,
  value,
  color,
  onClick,
  highlight = false,
  bold = false,
  clickable = false,
}) {
  return (
    <Box
      sx={{
        cursor: clickable ? "pointer" : "default",
        py: clickable ? 0.5 : 0,
      }}
      onClick={onClick}
    >
      {/* Label */}
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          mb: 0.5,
          fontSize: 13,
        }}
      >
        {label}
      </Typography>

      {/* Value */}
      <Typography
        variant="body1"
        sx={{
          fontWeight: bold || highlight ? 600 : 500,
          color: color || (highlight ? "primary.main" : "text.primary"),
          fontSize: highlight ? 16 : 14,
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
}
