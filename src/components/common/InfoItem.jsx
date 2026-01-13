import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { resolveComponent } from "@/utils/component";

export default function InfoItem({
  label,
  value,
  color,
  onClick,
  highlight = false,
  bold = false,
  icon,
  iconColor = "primary",
  ...props
}) {
  const valueColor = color || (highlight ? "primary.main" : "text.primary");
  const fontWeight = bold || highlight ? 600 : 500;

  return (
    <Stack spacing={1.2} direction="row" alignItems="center" {...props}>
      {icon &&
        resolveComponent(icon, {
          color: iconColor,
        })}
      <Box>
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
          {value || "-"}
        </Typography>
      </Box>
    </Stack>
  );
}
