import React from "react";
import { Box, Typography } from "@mui/material";
import { COLOR } from "../../assets/Color";

const StatusLabel = ({
  label = "label",
  color = COLOR.PrimaryBlack,
  sx = [],
  ...props
}) => {
  return (
    <Box
      {...props}
      px={2}
      sx={[
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `3px solid ${color}`,
          borderRadius: "5px",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography
        sx={{ color: color, margin: 0, fontWeight: 700, fontSize: 20 }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default StatusLabel;
