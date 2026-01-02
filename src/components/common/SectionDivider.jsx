import { Typography, Box, Divider } from "@mui/material";
import Color from "@constants/Color";

const SectionDivider = ({
  sectionName,
  title,
  color = Color.PrimaryBlackPlaceHolder,
  dividerColor,
  dividerProps,
  my = 3,
  sx,
  ...props
}) => {
  return (
    <Box
      {...props}
      my={my}
      sx={[
        {
          width: "100%",
          borderBottom: `2px solid ${Color.primary}`,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography color={color} variant="h6" fontWeight={700} mb={2}>
        {title || sectionName}
      </Typography>
      <Divider color={dividerColor} {...dividerProps} />
    </Box>
  );
};

export default SectionDivider;
