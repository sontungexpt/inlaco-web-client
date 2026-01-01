import React from "react";
import { Box } from "@mui/material";

const StickyHeader = ({ children, sx }) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        backgroundColor: "#F5F9FC",
        borderBottom: "1px solid #E0E0E0",
        ...sx,
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default StickyHeader;
