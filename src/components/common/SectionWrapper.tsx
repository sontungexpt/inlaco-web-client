import { ReactNode } from "react";
import {
  Paper,
  Typography,
  PaperProps,
  BoxProps,
  TypographyProps,
} from "@mui/material";
import SectionDivider from "./SectionDivider";

export type SectionWrapperProps = PaperProps & {
  elevation?: number;
  px?: number;
  py?: number;
  mb?: number;
  children: ReactNode;
  sx?: BoxProps["sx"];
  title?: string;
  titleProps?: TypographyProps;
  divider?: boolean;
};

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
}: SectionWrapperProps) => (
  <Paper
    {...props}
    elevation={elevation}
    sx={[
      {
        px,
        py,
        mb,
        borderRadius: 2,
        backgroundColor: "background.paper",
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
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
