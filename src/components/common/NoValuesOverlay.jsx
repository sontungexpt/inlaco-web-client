import { Typography, Box } from "@mui/material";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import Color from "@constants/Color";

const NoValuesOverlay = ({
  text = "KHÔNG CÓ DỮ LIỆU",
  subText = "Hiện chưa có bản ghi nào để hiển thị",
}) => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        color: "text.secondary",
        textAlign: "center",
        px: 4,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TableRowsOutlinedIcon
          sx={{
            width: 32,
            height: 32,
            color: "text.disabled",
          }}
        />
      </Box>

      <Typography
        variant="subtitle1"
        fontWeight={700}
        color={Color.PrimaryBlack}
      >
        {text}
      </Typography>

      {subText && (
        <Typography variant="body2" color="text.secondary">
          {subText}
        </Typography>
      )}
    </Box>
  );
};

export default NoValuesOverlay;
