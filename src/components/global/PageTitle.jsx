import { Typography, Box } from "@mui/material";
import { COLOR } from "../../assets/Color";

const PageTitle = ({ title, subtitle }) => {
  return (
    <Box mb="30px">
      <Typography variant="h5" color={COLOR.PrimaryBlack} fontWeight="bold">
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="h7"
          color={COLOR.SecondaryBlack}
          sx={{ fontStyle: "italic" }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageTitle;
