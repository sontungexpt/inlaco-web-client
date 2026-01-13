import React from "react";
import { Box, Stack, Typography } from "@mui/material";

export default function InfoItem({
  label,
  value = "-",
  color,
  onClick,
  highlight = false,
  bold = false,
  clickable = false,
  icon: Icon,
  iconColor = "primary",
  slotProps,
  ...props
}) {
  const valueColor = color || (highlight ? "primary.main" : "text.primary");
  const fontWeight = bold || highlight ? 600 : 500;

  return (
    <Stack spacing={1.2} direction="row" alignItems="center" {...props}>
      {Icon && typeof Icon === "function" ? (
        <Icon color={iconColor} sx={{ mt: "2px" }} />
      ) : (
        Icon
      )}
      <Box
        sx={{
          cursor: clickable ? "pointer" : "default",
          py: clickable ? 0.5 : 0,
        }}
        onClick={onClick}
        {...props}
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
            fontWeight,
            color: valueColor,
            fontSize: highlight ? 16 : 14,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}
