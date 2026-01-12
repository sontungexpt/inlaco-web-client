import React, {} from "react";
import { Box, Typography } from "@mui/material";

import Color from "@/constants/Color";

export default function InfoItem({ label, value }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 13,
          color: Color.PrimaryBlackPlaceHolder,
          mb: "2px",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 15,
          fontWeight: 600,
          color: Color.PrimaryBlack,
        }}
      >
        {value ?? "—"}
      </Typography>
    </Box>
  );
}
