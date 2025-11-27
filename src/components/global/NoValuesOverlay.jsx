import { Typography, Box } from "@mui/material";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import Color from "@constants/Color";

const NoValuesOverlay = ({ text = "KHÔNG CÓ DỮ LIỆU" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <TableRowsOutlinedIcon sx={{ width: 36, height: 36 }} />
      <Typography
        mt={1}
        variant="h6"
        color={Color.PrimaryBlack}
        fontWeight="bold"
        fontStyle="italic"
      >
        {text}
      </Typography>
    </Box>
  );
};

export default NoValuesOverlay;
