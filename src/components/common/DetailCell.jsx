import { IconButton, Tooltip, CircularProgress } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import Color from "@constants/Color";
import { memo } from "react";

const DetailCell = ({
  onClick,
  tooltip = "Xem chi tiết",
  disabled = false,
  loading = false,
  size = "small",
}) => {
  return (
    <Tooltip title={tooltip} arrow placement="left">
      <span>
        <IconButton
          size={size}
          onClick={onClick}
          disabled={disabled || loading}
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,

            backgroundColor: "rgba(76, 175, 80, 0.45)", // 👈 đậm hơn

            color: "text.secondary",
            transition: "all 0.2s ease",

            "&:hover": {
              color: Color.PrimaryGreen,
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              transform: "translateX(1px)",
            },

            "&:active": {
              transform: "translateX(0)",
            },

            "&.Mui-disabled": {
              backgroundColor: "action.disabledBackground",
              color: "action.disabled",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={14} color="inherit" />
          ) : (
            <ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default memo(DetailCell);
