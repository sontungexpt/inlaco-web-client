import React from "react";
import { Box, Typography } from "@mui/material";
import Color from "@constants/Color";

const StatusLabel = ({
  label,
  p = 1,
  sx = [],
  color = Color.PrimaryBlack,
  wrapperProps,
  ...props
}) => {
  return (
    <Box
      p={p}
      sx={[
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `2px solid ${color}`,
          borderRadius: "5px",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...wrapperProps}
    >
      <Typography color={color} fontWeight={700} fontSize={20} {...props}>
        {label}
      </Typography>
    </Box>
  );
};

export default StatusLabel;
