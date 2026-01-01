import { Typography, Box } from "@mui/material";
import Color from "@constants/Color";

const PageTitle = ({ title, subtitle, ...props }) => {
  return (
    <Box {...props}>
      <Typography variant="h5" color={Color.PrimaryBlack} fontWeight="bold">
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="h7"
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
