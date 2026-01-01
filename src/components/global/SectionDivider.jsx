import { Typography, Box } from "@mui/material";
import Color from "@constants/Color";

const SectionDivider = ({
  sectionName,
  title,
  color = Color.PrimaryBlackPlaceHolder,
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
      <Typography sx={{ fontSize: 18, color: color, fontStyle: "italic" }}>
        {title || sectionName}
      </Typography>
      <Box
        sx={{
          width: "100%",
          borderBottom: `2px solid ${color}`,
        }}
      />
    </Box>
  );
};

export default SectionDivider;
