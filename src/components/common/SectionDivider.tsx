import {
  Typography,
  Box,
  Divider,
  BoxProps,
  DividerProps,
} from "@mui/material";
import Color from "@constants/Color";

export type SectionDividerProps = BoxProps & {
  sectionName?: string;
  title?: string;
  color?: string;
  dividerColor?: string;
  dividerProps?: DividerProps;
  my?: number;
  sx?: BoxProps["sx"];
};

const SectionDivider = ({
  sectionName,
  title,
  color = Color.PrimaryBlackPlaceHolder,
  dividerColor,
  dividerProps,
  my = 3,
  sx,
  ...props
}: SectionDividerProps) => {
  return (
    <Box
      {...props}
      my={my}
      sx={[
        {
          width: "100%",
          borderBottom: `2px solid ${Color.PrimaryGray}`,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Typography color={color} variant="h6" fontWeight={700} mb={2}>
        {title || sectionName}
      </Typography>

      <Divider
        {...dividerProps}
        sx={{
          borderColor: dividerColor,
          ...(dividerProps?.sx || {}),
        }}
      />
    </Box>
  );
};

export default SectionDivider;
