import React, {} from "react";
import { Paper, Typography } from "@mui/material";
import SectionDivider from "./SectionDivider";

const SectionWrapper = ({ children, sx, title, divider, ...props }) => (
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
    {title &&
      (divider ? (
        <SectionDivider title={title} />
      ) : (
        <Typography variant="h6" fontWeight={700} mb={3}>
          {title}
        </Typography>
      ))}
    {children}
  </Paper>
);

export default SectionWrapper;
