import { Tooltip, CircularProgress } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import Color from "@constants/Color";

const DetailActionCell = ({
  onClick,
  tooltip = "Chi tiết",
  disabled = false,
  loading = false,
}) => {
  return (
    <Tooltip title={tooltip} arrow placement="top">
      <span>
        <GridActionsCellItem
          icon={
            loading ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              <ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />
            )
          }
          label={tooltip}
          onClick={onClick}
          disabled={disabled || loading}
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,

            backgroundColor: "rgba(76, 175, 80, 0.45)",
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
        />
      </span>
    </Tooltip>
  );
};

export default DetailActionCell;
