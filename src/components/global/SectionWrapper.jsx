import React, {} from "react";
import { Paper, Typography } from "@mui/material";
import { SectionDivider } from ".";

const SectionWrapper = ({
  children,
  sx,
  title,

  ...props
}) => (
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
    {title && <SectionDivider title={title} />}
    {children}
  </Paper>
);

export default SectionWrapper;
