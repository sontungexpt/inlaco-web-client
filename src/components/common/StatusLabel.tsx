import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import Color from "@constants/Color";

export type StatusLabelProps = TypographyProps & {
  label: string;
  color?: TypographyProps["color"];
  sx?: BoxProps["sx"];
  wrapperProps?: BoxProps;
};

const StatusLabel = ({
  label,
  p = 1,
  sx = [],
  color = Color.PrimaryBlack,
  wrapperProps,
  ...props
}: StatusLabelProps) => {
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
