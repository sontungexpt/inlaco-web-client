import React, {} from "react";
import { Paper, Typography } from "@mui/material";

const SectionWrapper = ({ children, sx, ...props }) => (
  <Paper
    elevation={1}
    sx={{
      p: 3,
      mb: 3,
      borderRadius: 2,
      backgroundColor: "background.paper",
      ...sx,
    }}
    {...props}
  >
    {children}
  </Paper>
);

export default SectionWrapper;
