import React, {} from "react";
import { Paper, Typography } from "@mui/material";

const SubSegmentWrapper = ({ title, children }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      borderRadius: 1.5,
      borderColor: "text.secondary",
    }}
  >
    <Typography
      sx={{
        fontSize: 14,
        fontWeight: 600,
        mb: 1.5,
        color: "text.secondary",
      }}
    >
      {title}
    </Typography>

    {children}
  </Paper>
);
export default SubSegmentWrapper;
