import { Typography, Box, BoxProps, TypographyProps } from "@mui/material";
import Color from "@constants/Color";
import { ReactNode } from "react";

type PageTitleProps = BoxProps & {
  title: ReactNode;
  subtitle?: ReactNode;
  titleProps?: TypographyProps;
  subtitleProps?: TypographyProps;
};

const PageTitle = ({ title, subtitle, ...props }: PageTitleProps) => {
  return (
    <Box {...props}>
      <Typography variant="h5" color={Color.PrimaryBlack} fontWeight="bold">
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="h6"
          color={Color.SecondaryBlack}
          sx={{ fontStyle: "italic" }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageTitle;
