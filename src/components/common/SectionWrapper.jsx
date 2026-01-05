import React, {} from "react";
import { Paper, Typography } from "@mui/material";
import SectionDivider from "./SectionDivider";

const SectionWrapper = ({
  elevation = 1,
  children,
  sx,
  title,
  divider,
  ...props
}) => (
  <Paper
    {...props}
    elevation={elevation}
    sx={[
      {
        px: 3,
        py: 2,
        mb: 3,
        borderRadius: 2,
        backgroundColor: "background.paper",
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
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
