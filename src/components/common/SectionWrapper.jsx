import React, {} from "react";
import { Paper, Typography } from "@mui/material";
import SectionDivider from "./SectionDivider";

const SectionWrapper = ({
  elevation = 1,
  px = 3,
  py = 2,
  mb = 3,
  children,
  sx,
  title,
  titleProps,
  divider,
  ...props
}) => (
  <Paper
    {...props}
    elevation={elevation}
    sx={[
      {
        px: px,
        py: py,
        mb: mb,
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
        <Typography variant="h6" fontWeight={700} mb={3} {...titleProps}>
          {title}
        </Typography>
      ))}
    {children}
  </Paper>
);

export default SectionWrapper;
